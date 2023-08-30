<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('event_gifts', function (Blueprint $table) {
            $table->ulid('event_id')->nullable();
            $table->string('name')->nullable();
            $table->smallInteger('quota')->default(0);
            $table->smallInteger('type')->default(0);
            $table->string('image')->nullable();

            $table->ulid('id')->primary();
            $table->timestamps();
            $table->softDeletes();
            $table->ulid('created_by')->nullable();
            $table->ulid('updated_by')->nullable();
            $table->ulid('deleted_by')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_gifts');
    }
};
