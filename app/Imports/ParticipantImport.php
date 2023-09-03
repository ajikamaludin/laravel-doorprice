<?php

namespace App\Imports;

use App\Models\Participant;
use Maatwebsite\Excel\Concerns\Importable;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class ParticipantImport implements ToModel, WithHeadingRow
{
    use Importable;

    public function __construct(public $eventId)
    {
    }

    /**
     * @return \Illuminate\Database\Eloquent\Model|null
     */
    public function model(array $row)
    {
        $participant = Participant::where('employee_code', $row['np'])
            ->where('event_id', $this->eventId)->exists();
        if ($participant) {
            return;
        }

        return new Participant([
            'event_id' => $this->eventId,
            'employee_code' => $row['np'],
            'name' => $row['full_name'],
            'phone' => $row['whatsapp_number'],
            'email' => $row['email'],
            'unit' => $row['unit_kerja'],
            'agency' => isset($row['instansi']) ? $row['instansi'] : null,
        ]);
    }
}
