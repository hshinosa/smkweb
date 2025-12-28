<?php

namespace Database\Factories;

use App\Models\Alumni;
use Illuminate\Database\Eloquent\Factories\Factory;

class AlumniFactory extends Factory
{
    protected $model = Alumni::class;

    public function definition(): array
    {
        return [
            'name' => $this->faker->name(),
            'graduation_year' => $this->faker->numberBetween(2000, date('Y')),
            'current_position' => $this->faker->jobTitle(),
            'education' => $this->faker->sentence(),
            'testimonial' => $this->faker->paragraph(),
            'category' => $this->faker->word(),
            'image_url' => null,
            'is_featured' => false,
            'is_published' => true,
            'sort_order' => $this->faker->numberBetween(1, 100),
        ];
    }
}
