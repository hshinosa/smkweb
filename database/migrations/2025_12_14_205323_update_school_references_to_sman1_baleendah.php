<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Define old and new school name mappings
        $schoolNameMappings = [
            'SMKN 15 Bandung' => 'SMAN 1 Baleendah',
            'SMK Negeri 15 Bandung' => 'SMA Negeri 1 Baleendah',
            'SMKN15 Bandung' => 'SMAN1 Baleendah',
            'SMK 15 Bandung' => 'SMA 1 Baleendah',
            'smkn15bandung' => 'sman1baleendah',
            'smk15bandung' => 'sma1baleendah',
            'SMKN15BANDUNG' => 'SMAN1BALEENDAH',
            'SMK15BANDUNG' => 'SMA1BALEENDAH',
        ];

        // Define old and new contact information mappings
        $contactMappings = [
            // Phone numbers (example old numbers to new)
            '(022) 1234567' => '(022) 7654321',
            '022-1234567' => '022-7654321',
            // Email addresses
            'info@smkn15bandung.sch.id' => 'info@sman1baleendah.sch.id',
            'admin@smkn15bandung.sch.id' => 'admin@sman1baleendah.sch.id',
            // Social media handles
            '@smkn15bandung' => '@sman1baleendah',
            'SMKN15Bandung' => 'SMAN1Baleendah',
            // Addresses
            'Bandung' => 'Baleendah',
            'Kota Bandung' => 'Kabupaten Bandung',
        ];

        // Define old and new program mappings (SMK to SMA programs)
        $programMappings = [
            'Teknik Komputer dan Jaringan' => 'MIPA (Matematika dan Ilmu Pengetahuan Alam)',
            'Multimedia' => 'IPS (Ilmu Pengetahuan Sosial)',
            'Rekayasa Perangkat Lunak' => 'Bahasa (Ilmu Bahasa dan Budaya)',
            'TKJ' => 'MIPA',
            'MM' => 'IPS',
            'RPL' => 'Bahasa',
            'kejuruan' => 'akademik',
            'vokasi' => 'akademik',
            'SMK' => 'SMA',
        ];

        // Combine all mappings
        $allMappings = array_merge($schoolNameMappings, $contactMappings, $programMappings);

        // Update landing_page_settings table
        if (Schema::hasTable('landing_page_settings')) {
            $landingPageSettings = DB::table('landing_page_settings')->get();

            foreach ($landingPageSettings as $setting) {
                $content = json_decode($setting->content, true);
                $updated = false;

                if (is_array($content)) {
                    $updatedContent = $this->updateContentRecursively($content, $allMappings);
                    if ($updatedContent !== $content) {
                        DB::table('landing_page_settings')
                            ->where('id', $setting->id)
                            ->update(['content' => json_encode($updatedContent)]);
                        $updated = true;
                    }
                }
            }
        }

        // Update spmb_settings table
        if (Schema::hasTable('spmb_settings')) {
            $spmbSettings = DB::table('spmb_settings')->get();

            foreach ($spmbSettings as $setting) {
                $content = json_decode($setting->content, true);
                $updated = false;

                if (is_array($content)) {
                    $updatedContent = $this->updateContentRecursively($content, $allMappings);
                    if ($updatedContent !== $content) {
                        DB::table('spmb_settings')
                            ->where('id', $setting->id)
                            ->update(['content' => json_encode($updatedContent)]);
                        $updated = true;
                    }
                }
            }
        }

        // Update academic_calendar_contents table
        if (Schema::hasTable('academic_calendar_contents')) {
            $calendarContents = DB::table('academic_calendar_contents')->get();

            foreach ($calendarContents as $content) {
                $updated = false;
                $newTitle = $content->title;

                // Update title field
                foreach ($allMappings as $old => $new) {
                    if (strpos($newTitle, $old) !== false) {
                        $newTitle = str_replace($old, $new, $newTitle);
                        $updated = true;
                    }
                }

                // Update calendar_image_url if it contains old references
                $newImageUrl = $content->calendar_image_url;
                if ($newImageUrl) {
                    foreach ($allMappings as $old => $new) {
                        if (strpos($newImageUrl, $old) !== false) {
                            $newImageUrl = str_replace($old, $new, $newImageUrl);
                            $updated = true;
                        }
                    }
                }

                if ($updated) {
                    DB::table('academic_calendar_contents')
                        ->where('id', $content->id)
                        ->update([
                            'title' => $newTitle,
                            'calendar_image_url' => $newImageUrl,
                        ]);
                }
            }
        }

        // Update activity_logs table if it exists (to update logged content)
        if (Schema::hasTable('activity_logs')) {
            $activityLogs = DB::table('activity_logs')->get();

            foreach ($activityLogs as $log) {
                $updated = false;
                $newDescription = $log->description ?? '';
                $newDetails = $log->details ?? '';

                // Update description field
                foreach ($allMappings as $old => $new) {
                    if (strpos($newDescription, $old) !== false) {
                        $newDescription = str_replace($old, $new, $newDescription);
                        $updated = true;
                    }
                    if (strpos($newDetails, $old) !== false) {
                        $newDetails = str_replace($old, $new, $newDetails);
                        $updated = true;
                    }
                }

                if ($updated) {
                    DB::table('activity_logs')
                        ->where('id', $log->id)
                        ->update([
                            'description' => $newDescription,
                            'details' => $newDetails,
                        ]);
                }
            }
        }
    }

    /**
     * Recursively update content arrays and strings
     */
    private function updateContentRecursively($content, $mappings)
    {
        if (is_string($content)) {
            foreach ($mappings as $old => $new) {
                $content = str_replace($old, $new, $content);
            }

            return $content;
        }

        if (is_array($content)) {
            foreach ($content as $key => $value) {
                $content[$key] = $this->updateContentRecursively($value, $mappings);
            }

            return $content;
        }

        return $content;
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Define reverse mappings (new to old)
        $reverseSchoolNameMappings = [
            'SMAN 1 Baleendah' => 'SMKN 15 Bandung',
            'SMA Negeri 1 Baleendah' => 'SMK Negeri 15 Bandung',
            'SMAN1 Baleendah' => 'SMKN15 Bandung',
            'SMA 1 Baleendah' => 'SMK 15 Bandung',
            'sman1baleendah' => 'smkn15bandung',
            'sma1baleendah' => 'smk15bandung',
            'SMAN1BALEENDAH' => 'SMKN15BANDUNG',
            'SMA1BALEENDAH' => 'SMK15BANDUNG',
        ];

        $reverseContactMappings = [
            '(022) 7654321' => '(022) 1234567',
            '022-7654321' => '022-1234567',
            'info@sman1baleendah.sch.id' => 'info@smkn15bandung.sch.id',
            'admin@sman1baleendah.sch.id' => 'admin@smkn15bandung.sch.id',
            '@sman1baleendah' => '@smkn15bandung',
            'SMAN1Baleendah' => 'SMKN15Bandung',
            'Baleendah' => 'Bandung',
            'Kabupaten Bandung' => 'Kota Bandung',
        ];

        $reverseProgramMappings = [
            'MIPA (Matematika dan Ilmu Pengetahuan Alam)' => 'Teknik Komputer dan Jaringan',
            'IPS (Ilmu Pengetahuan Sosial)' => 'Multimedia',
            'Bahasa (Ilmu Bahasa dan Budaya)' => 'Rekayasa Perangkat Lunak',
            'MIPA' => 'TKJ',
            'IPS' => 'MM',
            'Bahasa' => 'RPL',
            'akademik' => 'kejuruan',
            'SMA' => 'SMK',
        ];

        $allReverseMappings = array_merge($reverseSchoolNameMappings, $reverseContactMappings, $reverseProgramMappings);

        // Reverse the updates for all tables using the same logic but with reverse mappings
        if (Schema::hasTable('landing_page_settings')) {
            $landingPageSettings = DB::table('landing_page_settings')->get();

            foreach ($landingPageSettings as $setting) {
                $content = json_decode($setting->content, true);

                if (is_array($content)) {
                    $updatedContent = $this->updateContentRecursively($content, $allReverseMappings);
                    if ($updatedContent !== $content) {
                        DB::table('landing_page_settings')
                            ->where('id', $setting->id)
                            ->update(['content' => json_encode($updatedContent)]);
                    }
                }
            }
        }

        if (Schema::hasTable('spmb_settings')) {
            $spmbSettings = DB::table('spmb_settings')->get();

            foreach ($spmbSettings as $setting) {
                $content = json_decode($setting->content, true);

                if (is_array($content)) {
                    $updatedContent = $this->updateContentRecursively($content, $allReverseMappings);
                    if ($updatedContent !== $content) {
                        DB::table('spmb_settings')
                            ->where('id', $setting->id)
                            ->update(['content' => json_encode($updatedContent)]);
                    }
                }
            }
        }

        if (Schema::hasTable('academic_calendar_contents')) {
            $calendarContents = DB::table('academic_calendar_contents')->get();

            foreach ($calendarContents as $content) {
                $updated = false;
                $newTitle = $content->title;
                $newImageUrl = $content->calendar_image_url;

                foreach ($allReverseMappings as $new => $old) {
                    if (strpos($newTitle, $new) !== false) {
                        $newTitle = str_replace($new, $old, $newTitle);
                        $updated = true;
                    }
                    if ($newImageUrl && strpos($newImageUrl, $new) !== false) {
                        $newImageUrl = str_replace($new, $old, $newImageUrl);
                        $updated = true;
                    }
                }

                if ($updated) {
                    DB::table('academic_calendar_contents')
                        ->where('id', $content->id)
                        ->update([
                            'title' => $newTitle,
                            'calendar_image_url' => $newImageUrl,
                        ]);
                }
            }
        }

        if (Schema::hasTable('activity_logs')) {
            $activityLogs = DB::table('activity_logs')->get();

            foreach ($activityLogs as $log) {
                $updated = false;
                $newDescription = $log->description ?? '';
                $newDetails = $log->details ?? '';

                foreach ($allReverseMappings as $new => $old) {
                    if (strpos($newDescription, $new) !== false) {
                        $newDescription = str_replace($new, $old, $newDescription);
                        $updated = true;
                    }
                    if (strpos($newDetails, $new) !== false) {
                        $newDetails = str_replace($new, $old, $newDetails);
                        $updated = true;
                    }
                }

                if ($updated) {
                    DB::table('activity_logs')
                        ->where('id', $log->id)
                        ->update([
                            'description' => $newDescription,
                            'details' => $newDetails,
                        ]);
                }
            }
        }
    }
};
