<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    {{-- @vite(['resources/css/app.css']) --}}
    <style>
        table, th, td {
            border: 1px solid;
            padding: 1rem;
        }
    </style>
</head>

@php 
function maskPhone($inputString) {
    // Check if the inputString has at least 3 characters
    if (strlen($inputString) < 3) {
        return "Input string is too short.";
    }

    // Calculate the start index for replacing characters
    $startIndex = floor((strlen($inputString) - 3) / 2);

    // Replace the center 3 characters with "XXX"
    $replacedString = substr($inputString, 0, $startIndex) . "XXX" . substr($inputString, $startIndex + 3);

    return $replacedString;
}
@endphp

<body>
    <center >
        @if ($event->image != null)
        <img src="{{ public_path($event->image) }}" style="height: 14rem;margin: auto"/>
        @endif
        <div style="font-size: 2.25rem; line-height: 2.5rem; font-weight: 700; margin-top: 1rem;margin: auto">Pemenang {{ $event->name }}</div>
        <div style="font-size: 1.25rem; line-height: 1.75rem; font-weight: 700; margin-bottom: 1rem;margin: auto    ">{{ $event->date }}</div>
    </center>
    <div className="overflow-auto">
        <div>
            <table style=" border-collapse: collapse;">
                <thead>
                    <tr>
                        <th
                            scope="col"
                        >
                            NP
                        </th>
                        <th scope="col">
                            Nama
                        </th>
                        <th
                            scope="col"
                        >
                            No Telp
                        </th>
                        <th
                            scope="col"
                        >
                            Unit Kerja
                        </th>
                        <th
                            scope="col"
                        >
                            Hadiah
                        </th>
                        <th
                            scope="col"
                        >
                            Jenis Hadiah
                        </th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($results as $result)
                        <tr
                        >
                            <td
                                scope="row"

                            >
                                {{
                                    $result->participant
                                        ->employee_code
                                }}
                            </td>
                            <td >
                                {{$result->participant->name}}
                            </td>
                            <td >
                                {{maskPhone($result->participant->phone)}}
                            </td>
                            <td >
                                {{$result->participant->unit}}
                            </td>
                            <td >
                                {{$result->gift->name}}
                            </td>
                            <td >
                                {{$result->gift->type_text}}
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
</body>
</html>