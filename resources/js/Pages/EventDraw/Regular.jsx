import { Head, Link, router, useForm } from '@inertiajs/react'

import GiftSelectionInput from '../EventGift/SelectionInput'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Spinner } from 'flowbite-react'
import { isEmpty } from 'lodash'
import axios from 'axios'
import { maskPhone } from '@/utils'

export default function Regular(props) {
    const { event, flash, _participants } = props

    const seeds = _participants.map((p) => p.employee_code)
    const [quota, setQuota] = useState(0)
    const [winner, setWinner] = useState(null)
    const [run, setRun] = useState(false)
    const [loading, setLoading] = useState(false)

    const [pastParticipants, setPastParticipants] = useState([])

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
            setQuota(gift.quota_count)
            setPastParticipants(gift.result.map((r) => r.participant))
            return
        }
        setData('gift_id', null)
        setPastParticipants([])
    }

    const handleClickStartOrStop = () => {
        if (+quota === 0) {
            toast.error('Kuota hadiah habis')
            return
        }
        if (gift === null) {
            toast.error('Pilih Hadiah terlebih dahulu')
            return
        }
        if (run === true) {
            setRun(!run)
            setData(
                'participants',
                data.participants.map((p, i) => {
                    if (i === 0) {
                        return winner
                    }
                    return p
                })
            )
            setQuota(gift.quota_count - data.participants.length)
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
                    [
                        {
                            id: 'NNN',
                            employee_code: ' - ',
                            name: ' - ',
                            phone: ' - ',
                        },
                    ].concat(data.participants)
                )
                setRun(true)
            })
            .catch((err) => toast.error('Terjadi kesalahan reload halaman'))
            .finally(() => {
                setLoading(false)
            })
    }

    const handleDelete = () => {
        setData('participants', data.participants.slice(1))
        setQuota(quota + 1)
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
                        if (i === 0) {
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
            className="flex flex-col justify-center items-center w-full px-12 py-2 min-h-screen"
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
                            <div className="outlined-text">Kuota: {quota}</div>
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
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mb-4 ">
                        <thead className="flex flex-col w-full text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr className="flex w-full">
                                <th scope="col" className="py-3 px-6 w-1/4">
                                    NP
                                </th>
                                <th scope="col" className="py-3 px-6 w-1/4">
                                    Nama
                                </th>
                                <th scope="col" className="py-3 px-6 w-1/4">
                                    No Telp
                                </th>
                                <th scope="col" className="py-3 px-6 w-1/4">
                                    Hadiah
                                </th>
                            </tr>
                        </thead>
                        <tbody
                            className="bg-grey-light flex flex-col items-center overflow-y-scroll w-full"
                            style={{ height: '30vh' }}
                        >
                            {data.participants.map((winner) => (
                                <tr
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 flex w-full"
                                    key={winner.id}
                                >
                                    <td
                                        scope="row"
                                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white w-1/4"
                                    >
                                        {winner.employee_code}
                                    </td>
                                    <td className="py-4 px-6 w-1/4">
                                        {winner.name}
                                    </td>
                                    <td className="py-4 px-6 w-1/4">
                                        {maskPhone(winner.phone)}
                                    </td>
                                    <td className="py-4 px-6 w-1/4">
                                        {gift.name}
                                    </td>
                                </tr>
                            ))}
                            {pastParticipants.map((winner) => (
                                <tr
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 flex w-full"
                                    key={winner.id}
                                >
                                    <td
                                        scope="row"
                                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white w-1/4"
                                    >
                                        {winner.employee_code}
                                    </td>
                                    <td className="py-4 px-6 w-1/4">
                                        {winner.name}
                                    </td>
                                    <td className="py-4 px-6 w-1/4">
                                        {maskPhone(winner.phone)}
                                    </td>
                                    <td className="py-4 px-6 w-1/4">
                                        {gift.name}
                                    </td>
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
