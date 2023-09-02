import React, { useRef } from 'react'
import { Head, useForm } from '@inertiajs/react'

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import Button from '@/Components/Button'
import EventSelectionInput from '../Event/SelectionInput'
import FormFile from '@/Components/FormFile'

export default function Import(props) {
    const inputRef = useRef()
    const { data, setData, post, processing, errors } = useForm({
        event_id: null,
        file: null,
    })

    const handleSubmit = () => {
        post(route('participant.import'))
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            page={'Import'}
            action={''}
        >
            <Head title="Import" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col">
                        <div className="text-xl font-bold mb-4">Import</div>
                        <EventSelectionInput
                            label="Event"
                            itemSelected={data.event_id}
                            onItemSelected={(item) =>
                                setData('event_id', item.id)
                            }
                            error={errors.event_id}
                        />
                        <FormFile
                            inputRef={inputRef}
                            label={'File'}
                            onChange={(e) => setData('file', e.target.files[0])}
                            error={errors.file}
                            help={
                                <p
                                    className="mt-1 text-sm text-gray-500 dark:text-gray-300"
                                    id="file_input_help"
                                >
                                    excel format import can be download{' '}
                                    <a
                                        href="/import.xlsx"
                                        download="/import.xlsx"
                                        className="text-blue-500"
                                    >
                                        here
                                    </a>
                                </p>
                            }
                        />
                        <div className="mt-2">
                            <Button
                                onClick={handleSubmit}
                                processing={processing}
                            >
                                Simpan
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
