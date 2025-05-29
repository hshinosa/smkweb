import React, { useRef, useState, useEffect } from 'react';
import { Bold, Italic, Pilcrow, AlignLeft, AlignCenter, AlignRight, List, ListOrdered } from 'lucide-react';

// Helper untuk membersihkan HTML dari tag yang tidak diinginkan sebelum simpan
const sanitizeHtml = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, 'text/html');
    // Hapus atribut style dan class yang mungkin disisipkan browser
    doc.body.querySelectorAll('*').forEach(el => {
        el.removeAttribute('style');
        el.removeAttribute('class');
    });
    // Hapus tag yang tidak diinginkan, misal <script>
    doc.body.querySelectorAll('script, style, link, meta').forEach(el => el.remove());
    return doc.body.innerHTML;
};

const MiniTextEditor = ({ initialValue = "", onChange, label, error }) => {
    const editorRef = useRef(null);
    const [content, setContent] = useState(initialValue);

    useEffect(() => {
        setContent(initialValue); // Update content jika initialValue berubah dari props
    }, [initialValue]);

    const handleContentChange = (e) => {
        const newContent = e.target.innerHTML;
        setContent(newContent);
        if (onChange) {
            onChange(sanitizeHtml(newContent)); // Kirim HTML yang sudah dibersihkan
        }
    };

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current.focus(); // Kembalikan fokus setelah command
        // Update state setelah execCommand untuk merefleksikan perubahan ke parent
        const updatedContent = editorRef.current.innerHTML;
        setContent(updatedContent);
        if (onChange) {
            onChange(sanitizeHtml(updatedContent));
        }
    };

    const formatBlock = (tag) => {
        // execCommand('formatBlock', false, `<${tag}>`) kadang aneh perilakunya
        // Alternatif: wrap selection, tapi lebih kompleks.
        // Untuk paragraf baru, user bisa tekan Enter.
        // Untuk bold/italic, execCommand lebih reliable.
        // Ini adalah contoh SANGAT sederhana.
        // Untuk paragraf, biasanya user cukup tekan Enter.
        // Jika Anda butuh kontrol lebih, pertimbangkan library editor seperti TipTap atau Quill.
        if (tag === 'p') { // Hanya untuk Enter
            document.execCommand('insertParagraph', false, null);
        }
        editorRef.current.focus();
        const updatedContent = editorRef.current.innerHTML;
        setContent(updatedContent);
        if (onChange) {
            onChange(sanitizeHtml(updatedContent));
        }
    };


    return (
        <div className="mb-4">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <div className="border border-gray-300 rounded-md shadow-sm">
                <div className="flex items-center p-2 border-b bg-gray-50 space-x-1">
                    <button type="button" onClick={() => execCommand('bold')} title="Bold" className="p-1.5 hover:bg-gray-200 rounded"><Bold size={16} /></button>
                    <button type="button" onClick={() => execCommand('italic')} title="Italic" className="p-1.5 hover:bg-gray-200 rounded"><Italic size={16} /></button>
                    {/* Tombol formatBlock untuk <p> bisa dihapus jika Enter sudah cukup */}
                    {/* <button type="button" onClick={() => formatBlock('p')} title="Paragraf" className="p-1.5 hover:bg-gray-200 rounded"><Pilcrow size={16} /></button> */}
                    {/* Tambahkan tombol lain jika perlu: list, align, dll. */}
                </div>
                <div
                    ref={editorRef}
                    contentEditable={true}
                    dangerouslySetInnerHTML={{ __html: content }}
                    onInput={handleContentChange}
                    onBlur={handleContentChange} // Update juga onBlur
                    className="mt-1 block w-full p-2 min-h-[150px] prose prose-sm max-w-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }} // Untuk handle paragraf
                />
            </div>
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
};

export default MiniTextEditor;