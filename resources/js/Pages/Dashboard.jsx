import React, { useEffect, useState } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, router } from '@inertiajs/react'
import EventSelectionInput from './Event/SelectionInput'
import { usePrevious } from 'react-use'
import Pagination from '@/Components/Pagination'
import { formatIDR, hasPermission } from '@/utils'
import { useModalState } from '@/hooks'
import ModalConfirm from '@/Components/ModalConfirm'
import { Button } from 'flowbite-react'
import SearchInput from '@/Components/SearchInput'

export default function Dashboard(props) {
    const {
        auth,
        query: { links, data },
        app_name,
        app_logo,
        participant,
        eventgift,
        result,
    } = props

    const [event, setEvent] = useState(null)
    const [search, setSearch] = useState('')
    const preValue = usePrevious(`${event}${search}`)

    const confirmModal = useModalState()

    const handleDeleteClick = (result) => {
        confirmModal.setData(result)
        confirmModal.toggle()
    }

    const onDelete = () => {
        if (confirmModal.data !== null) {
            router.delete(route('draw.destroy', confirmModal.data.id))
        }
    }

    const params = { event_id: event?.id }
    useEffect(() => {
        if (preValue) {
            router.get(
                route(route().current()),
                { event_id: event?.id, q: search },
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [event, search])

    const canDelete = hasPermission(auth, 'delete-draw')

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            page={'Dashboard'}
            action={''}
        >
            <Head title="Dashboard" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="overflow-hidden shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 w-full py-4">
                        <div className="pt-2 dark:text-gray-100 text-center text-xl font-bold">
                            {app_name}
                        </div>
                        <img src={app_logo} className="h-24 w-24 mx-auto" />
                    </div>
                    <div className="w-full py-2">
                        <EventSelectionInput
                            placeholder="filter event"
                            itemSelected={event?.id}
                            onItemSelected={(item) => setEvent(item)}
                        />
                    </div>
                    <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-2">
                        <div className="overflow-hidden shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 rounded-lg">
                            <div className="p-4 dark:text-gray-100 ">
                                <div className="text-xl">Jumlah Peserta</div>
                                <div className="text-2xl font-bold">
                                    {formatIDR(participant)}
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 rounded-lg">
                            <div className="p-4 dark:text-gray-100 ">
                                <div className="text-xl">Jumlah Hadiah</div>
                                <div className="text-2xl font-bold">
                                    {formatIDR(eventgift)}
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 rounded-lg">
                            <div className="p-4 dark:text-gray-100 ">
                                <div className="text-xl">
                                    Jumlah Pemenang / Total Hadiah
                                </div>
                                <div className="text-2xl font-bold">
                                    {formatIDR(result)} / {formatIDR(eventgift)}
                                </div>
                            </div>
                        </div>
                        <div className="overflow-hidden shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 rounded-lg">
                            <div className="p-4 dark:text-gray-100 ">
                                <div className="text-xl">Jumlah Pemenang</div>
                                <div className="text-2xl font-bold">
                                    {formatIDR(result)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="overflow-auto mt-2 p-4 bg-gray-200 rounded-md">
                        <div className="w-full flex flex-row justify-between py-2">
                            <a
                                href={route('dashboard.export', {
                                    event_id: event?.id,
                                })}
                            >
                                <Button size="sm">Export</Button>
                            </a>
                            <div className="flex items-center">
                                <SearchInput
                                    onChange={(e) => setSearch(e.target.value)}
                                    value={search}
                                />
                            </div>
                        </div>
                        <div>
                            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    <tr>
                                        <th scope="col" className="py-3 px-6">
                                            NP
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Nama
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            No Telp
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Unit Kerja
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Hadiah
                                        </th>
                                        <th scope="col" className="py-3 px-6">
                                            Jenis Hadiah
                                        </th>
                                        <th
                                            scope="col"
                                            className="py-3 px-6"
                                        ></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((result) => (
                                        <tr
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                            key={result.id}
                                        >
                                            <td
                                                scope="row"
                                                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                {
                                                    result.participant
                                                        .employee_code
                                                }
                                            </td>
                                            <td className="py-4 px-6">
                                                {result.participant.name}
                                            </td>
                                            <td className="py-4 px-6">
                                                {result.participant.phone}
                                            </td>
                                            <td className="py-4 px-6">
                                                {result.participant.unit}
                                            </td>
                                            <td className="py-4 px-6">
                                                {result.gift.name}
                                            </td>
                                            <td className="py-4 px-6">
                                                {result.gift.type_text}
                                            </td>
                                            <td className="py-4 px-6 underline text-red-700">
                                                {canDelete && (
                                                    <div
                                                        onClick={() =>
                                                            handleDeleteClick(
                                                                result
                                                            )
                                                        }
                                                    >
                                                        Reset
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="w-full flex items-center justify-center">
                            <Pagination links={links} params={params} />
                        </div>
                    </div>
                </div>
            </div>
            <ModalConfirm modalState={confirmModal} onConfirm={onDelete} />
        </AuthenticatedLayout>
    )
}
