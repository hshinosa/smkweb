<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RagDocument;
use App\Services\RagService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class RagDocumentController extends Controller
{
    protected RagService $ragService;

    public function __construct(RagService $ragService)
    {
        $this->ragService = $ragService;
    }

    public function index()
    {
        $documents = RagDocument::with('uploader')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/RagDocuments/Index', [
            'documents' => $documents,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/RagDocuments/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required_without:file|string',
            'excerpt' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'file' => 'nullable|file|mimes:pdf,txt,doc,docx|max:10240', // 10MB max
            'is_active' => 'boolean',
        ]);

        $document = new RagDocument();
        $document->title = $validated['title'];
        $document->excerpt = $validated['excerpt'] ?? null;
        $document->category = $validated['category'] ?? 'Umum';
        $document->is_active = $validated['is_active'] ?? true;
        $document->uploaded_by = Auth::guard('admin')->id();
        $document->source = $request->hasFile('file') ? 'upload' : 'manual';

        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('rag_documents', 'public');
            
            $document->file_path = $path;
            $document->file_type = $file->getClientOriginalExtension();
            $document->file_size = $file->getSize();
            
            // Extract text from file (basic implementation)
            $document->content = $this->extractTextFromFile($file);
        } else {
            $document->content = $validated['content'];
        }

        $document->save();

        // Process document (generate chunks and embeddings)
        $this->ragService->processDocument($document);

        return redirect()->route('admin.rag-documents.index')
            ->with('success', 'Dokumen berhasil ditambahkan dan diproses untuk RAG.');
    }

    public function edit(RagDocument $ragDocument)
    {
        $ragDocument->load('uploader');
        
        return Inertia::render('Admin/RagDocuments/Edit', [
            'document' => $ragDocument,
        ]);
    }

    public function update(Request $request, RagDocument $ragDocument)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'is_active' => 'boolean',
        ]);

        $ragDocument->update($validated);

        // Reprocess document if content changed
        if ($ragDocument->wasChanged('content')) {
            $this->ragService->processDocument($ragDocument);
        }

        return redirect()->route('admin.rag-documents.index')
            ->with('success', 'Dokumen berhasil diperbarui.');
    }

    public function destroy(RagDocument $ragDocument)
    {
        // Delete file if exists
        if ($ragDocument->file_path) {
            Storage::disk('public')->delete($ragDocument->file_path);
        }

        $ragDocument->delete();

        return redirect()->route('admin.rag-documents.index')
            ->with('success', 'Dokumen berhasil dihapus.');
    }

    /**
     * Reprocess document chunks and embeddings
     */
    public function reprocess(RagDocument $ragDocument)
    {
        $this->ragService->processDocument($ragDocument);

        return back()->with('success', 'Dokumen berhasil diproses ulang.');
    }

    /**
     * Extract text from uploaded file
     * Supports: TXT (built-in), PDF (with smalot/pdfparser), DOCX (with phpoffice/phpword)
     */
    protected function extractTextFromFile($file): string
    {
        $extension = $file->getClientOriginalExtension();

        // TXT files - built-in support
        if ($extension === 'txt') {
            return file_get_contents($file->getRealPath());
        }

        // PDF files - requires: composer require smalot/pdfparser
        if ($extension === 'pdf') {
            if (class_exists('\Smalot\PdfParser\Parser')) {
                try {
                    $parser = new \Smalot\PdfParser\Parser();
                    $pdf = $parser->parseFile($file->getRealPath());
                    $text = $pdf->getText();
                    return !empty($text) ? $text : "PDF content is empty or unreadable.";
                } catch (\Exception $e) {
                    \Log::error('PDF extraction failed', [
                        'file' => $file->getClientOriginalName(),
                        'error' => $e->getMessage()
                    ]);
                    return "PDF extraction error: " . $e->getMessage();
                }
            } else {
                return "PDF extraction requires 'smalot/pdfparser' package.\n\nRun: composer require smalot/pdfparser";
            }
        }

        // DOCX files - requires: composer require phpoffice/phpword
        if (in_array($extension, ['doc', 'docx'])) {
            if (class_exists('\PhpOffice\PhpWord\IOFactory')) {
                try {
                    $phpWord = \PhpOffice\PhpWord\IOFactory::load($file->getRealPath());
                    $text = '';
                    foreach ($phpWord->getSections() as $section) {
                        foreach ($section->getElements() as $element) {
                            if (method_exists($element, 'getText')) {
                                $text .= $element->getText() . "\n";
                            } elseif (method_exists($element, 'getElements')) {
                                // Handle nested elements (tables, etc)
                                foreach ($element->getElements() as $childElement) {
                                    if (method_exists($childElement, 'getText')) {
                                        $text .= $childElement->getText() . " ";
                                    }
                                }
                                $text .= "\n";
                            }
                        }
                    }
                    return !empty($text) ? trim($text) : "DOCX content is empty.";
                } catch (\Exception $e) {
                    \Log::error('DOCX extraction failed', [
                        'file' => $file->getClientOriginalName(),
                        'error' => $e->getMessage()
                    ]);
                    return "DOCX extraction error: " . $e->getMessage();
                }
            } else {
                return "DOCX extraction requires 'phpoffice/phpword' package.\n\nRun: composer require phpoffice/phpword";
            }
        }

        // Unsupported file type
        return "File type '{$extension}' is not supported.\n\nSupported: TXT, PDF (with smalot/pdfparser), DOCX (with phpoffice/phpword)";
    }
}

