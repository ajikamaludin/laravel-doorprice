import React, { useEffect, useState } from 'react'
import { router } from '@inertiajs/react'
import { usePrevious } from 'react-use'
import { Head } from '@inertiajs/react'

import Button from '@/Components/Button'
import Pagination from '@/Components/Pagination'
import SearchInput from '@/Components/SearchInput'
import { maskPhone } from '@/utils'

export default function Result(props) {
    const {
        query: { links, data },
        event,
        app_name,
        app_logo,
    } = props

    const [search, setSearch] = useState('')
    const preValue = usePrevious(search)

    const params = { q: search }
    useEffect(() => {
        if (preValue) {
            router.get(
                route(route().current(), event),
                { q: search },
                {
                    replace: true,
                    preserveState: true,
                }
            )
        }
    }, [search])

    return (
        <div>
            <Head title="Event" />
            <div className="flex flex-col items-center w-full my-6">
                <div className="flex flex-row mx-auto items-center justify-between gap-10">
                    <img src={app_logo} className="w-16 h-16" />
                    <div className="text-3xl">{app_name}</div>
                </div>
            </div>
            <div className="flex flex-col items-center mx-auto mb-10">
                <div className="text-5xl font-bold">{event.name}</div>
            </div>
            <div>
                <div className="mx-auto sm:px-6 lg:px-8 ">
                    <div className="p-6 overflow-hidden shadow-sm sm:rounded-lg bg-gray-200 dark:bg-gray-800 space-y-4">
                        <div className="flex justify-between">
                            <a href={route('draw.export-pdf', event)}>
                                <Button size="sm">Export</Button>
                            </a>
                            <div className="flex items-center">
                                <SearchInput
                                    onChange={(e) => setSearch(e.target.value)}
                                    value={search}
                                />
                            </div>
                        </div>
                        <div className="overflow-auto">
                            <div>
                                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                NP
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Nama
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                No Telp
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Unit Kerja
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Hadiah
                                            </th>
                                            <th
                                                scope="col"
                                                className="py-3 px-6"
                                            >
                                                Jenis Hadiah
                                            </th>
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
                                                    {maskPhone(
                                                        result.participant.phone
                                                    )}
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
            </div>
        </div>
    )
}
