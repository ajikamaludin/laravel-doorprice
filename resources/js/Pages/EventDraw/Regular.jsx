import { Head, Link, router, useForm } from '@inertiajs/react'

import GiftSelectionInput from '../EventGift/SelectionInput'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Spinner } from 'flowbite-react'
import { delay, isEmpty } from 'lodash'
import axios from 'axios'

export default function Regular(props) {
    const { event, flash, _participants } = props

    const seeds = _participants.map((p) => p.employee_code)
    const [winner, setWinner] = useState(null)
    const [run, setRun] = useState(false)
    const [loading, setLoading] = useState(false)

    const { data, setData, post, processing, errors } = useForm({
        event_id: event.id,
        gift_id: null,
        participants: [],
    })

    const [gift, setGift] = useState(null)

    const handleSetGift = (gift) => {
        if (gift !== null && gift.result_count >= gift.quota) {
            toast.error('Kuota Hadiah Habis')
            return
        }
        setGift(gift)
        if (gift !== null) {
            setData('gift_id', gift.id)
            return
        }
        setData('gift_id', null)
    }

    const handleClickStartOrStop = () => {
        if (gift === null) {
            toast.error('Pilih Hadiah terlebih dahulu')
            return
        }
        if (run === true) {
            setRun(!run)
            setData(
                'participants',
                data.participants.map((p, i) => {
                    if (i === data.participants.length - 1) {
                        return winner
                    }
                    return p
                })
            )
            return
        }
        // request ke api reguler
        setLoading(true)
        axios
            .get(
                route('api.draw.reguler', {
                    event,
                    quota: gift.quota,
                    except_id: data.participants.map((p) => p.id),
                })
            )
            .then((res) => {
                if (isEmpty(res.data)) {
                    toast.error('Semua peserta sudah memang')
                    return
                }
                setWinner(res.data)
                setData(
                    'participants',
                    data.participants.concat({
                        id: 'NNN',
                        employee_code: ' - ',
                        name: ' - ',
                        phone: ' - ',
                    })
                )
                setRun(true)
            })
            .catch((err) => toast.error('Terjadi kesalahan reload halaman'))
            .finally(() => {
                setLoading(false)
            })
    }

    const handleDelete = () => {
        setData('participants', data.participants.slice(0, -1))
    }

    const handleSubmit = () => {
        post(route('draw.store.reluger', event), {
            onSuccess: () => {
                setTimeout(
                    () => router.get(route(route().current(), event)),
                    1000
                )
            },
        })
    }

    useEffect(() => {
        if (flash.message !== null) {
            toast(flash.message.message, { type: flash.message.type })
        }
    }, [flash])

    useEffect(() => {
        if (isEmpty(errors) === false) {
            toast.error('Terjadi kesalahan, refresh halaman')
        }
    }, [errors])

    useEffect(() => {
        let interval = null
        if (run == true) {
            interval = setInterval(() => {
                setData(
                    'participants',
                    data.participants.map((p, i) => {
                        if (i === data.participants.length - 1) {
                            return {
                                ...p,
                                employee_code:
                                    seeds[
                                        Math.floor(Math.random() * seeds.length)
                                    ],
                            }
                        }
                        return p
                    })
                )
            }, 100)
        }
        return () => clearInterval(interval)
    }, [run])

    return (
        <div
            className="flex flex-col justify-center items-center w-full p-12"
            style={{
                backgroundImage: `url(${event.image_url})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Head title="Undian Hadiah Utama" />
            <div className="flex flex-col items-center mx-auto mb-4">
                <div className="text-5xl font-bold outlined-text">
                    {event.name}
                </div>
                <div className="text-2xl outlined-text">Undian Reguler</div>
            </div>
            <div
                className={`flex flex-row justify-evenly items-center w-full my-6 ${
                    loading && 'invisible'
                }`}
            >
                <div>
                    {gift !== null ? (
                        <div
                            onClick={() => handleSetGift(null)}
                            className="text-center"
                        >
                            <img
                                src={gift.image_url}
                                className="mb-1 max-h-32 w-full object-contain"
                                alt="preview"
                            />
                            <div className="text-2xl font-bold outlined-text">
                                {gift.name}
                            </div>
                            <div className="outlined-text">
                                Kuota: {gift.quota_count}
                            </div>
                        </div>
                    ) : (
                        <GiftSelectionInput
                            placeholder="Pilih Hadiah"
                            itemSelected={data.gift_id}
                            onItemSelected={(item) => handleSetGift(item)}
                            type="1"
                            event_id={event.id}
                        />
                    )}
                </div>
                <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg px-2 py-4">
                    <div className="my-2 font-bold">Table data pemenang</div>
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
                                    Hadiah
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.participants.map((winner) => (
                                <tr
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                    key={winner.id}
                                >
                                    <td
                                        scope="row"
                                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                        {winner.employee_code}
                                    </td>
                                    <td className="py-4 px-6">{winner.name}</td>
                                    <td className="py-4 px-6">
                                        {winner.phone}
                                    </td>
                                    <td className="py-4 px-6">{gift.name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex flex-col items-center w-full mt-16 gap-1">
                {loading ? (
                    <Spinner />
                ) : (
                    <div className="flex flex-row gap-1">
                        <button
                            className="py-4 px-12 border border-black text-2xl text-white bg-blue-700 rounded-lg"
                            onClick={handleClickStartOrStop}
                            disabled={loading}
                        >
                            {run ? 'Stop' : 'Start'}
                        </button>
                        {data.participants.length > 0 && run === false && (
                            <button
                                className="py-4 px-12 border border-black text-2xl text-white bg-red-700 rounded-lg"
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                Hapus
                            </button>
                        )}
                    </div>
                )}

                <div className="flex flex-row gap-3 mt-2">
                    <button
                        className="px-2 py-1 border border-black text-2xl text-white bg-green-700 rounded-lg"
                        onClick={handleSubmit}
                        disabled={processing}
                    >
                        {processing ? <Spinner /> : 'Simpan'}
                    </button>

                    <Link
                        href={route('draw.index')}
                        className="px-2 py-1 border border-black text-2xl rounded-lg bg-white"
                    >
                        Kembali
                    </Link>
                </div>
            </div>
            <ToastContainer />
        </div>
    )
}
