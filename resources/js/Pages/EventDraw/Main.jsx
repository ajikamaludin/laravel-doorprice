import { Head, Link, router, useForm } from '@inertiajs/react'

import GiftSelectionInput from '../EventGift/SelectionInput'
import { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Spinner } from 'flowbite-react'
import { isEmpty } from 'lodash'
import { maskPhone } from '@/utils'

export default function Main(props) {
    const { event, participants, _winner, flash } = props

    const [run, setRun] = useState(false)
    const [text, setText] = useState('33.25.091.007.XXX.XXXX.0')
    const seeds = participants.map((p) => p.employee_code)

    const [gift, setGift] = useState(null)

    const [winner, setWinner] = useState(null)

    const { data, setData, post, processing, errors } = useForm({
        event_id: event.id,
        gift_id: null,
        participant_id: null,
    })

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

    const handleOnStartStop = () => {
        if (gift === null) {
            toast.error('Pilih Hadiah terlebih dahulu')
            return
        }
        if (isEmpty(_winner)) {
            toast.error('Semua peserta sudah menang')
            return
        }
        setRun(!run)
        if (!run === false) {
            setWinner(_winner)
            setData('participant_id', _winner.id)
        }
    }

    const handleOnDelete = () => {
        setWinner(null)
        setText('33.25.091.007.XXX.XXXX.0')
        router.reload()
    }

    const handleSubmit = () => {
        post(route('draw.store.main', event))
    }

    useEffect(() => {
        let interval = null
        if (run == true) {
            interval = setInterval(() => {
                setText(seeds[Math.floor(Math.random() * seeds.length)])
            }, 100)
        }
        return () => clearInterval(interval)
    }, [run])

    useEffect(() => {
        if (winner !== null) {
            setText(winner.employee_code)
        }
    }, [winner])

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

    return (
        <div
            className="flex flex-col justify-center items-center w-full p-8 min-h-screen"
            style={{
                backgroundImage: `url(${event.image_url})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Head title="Undian Hadiah Utama" />
            <div className="flex flex-col items-center mx-auto">
                <div className="text-5xl text-red-800">{event.name}</div>
                <div className="text-2xl text-red-800">Hadiah Utama</div>
            </div>
            <div className="flex flex-col text-red-800 items-center mx-auto my-6 ">
                {gift !== null ? (
                    <div
                        onClick={() => handleSetGift(null)}
                        className="text-center"
                    >
                        <div className="bg-red-500 rounded-xl">

                        <img
                            src={gift.image_url}
                            className="mb-1 max-h-32 w-full object-contain"
                            alt="preview"
                            />
                        </div>
                        <div className="text-2xl font-bold">
                            {gift.name}
                        </div>
                    </div>
                ) : (
                    <GiftSelectionInput
                        placeholder="Pilih Hadiah"
                        itemSelected={data.gift_id}
                        onItemSelected={(item) => handleSetGift(item)}
                        type="0"
                        event_id={event.id}
                    />
                )}
            </div>
            <div className={`flex flex-col items-center w-full`}>
                <div className="text-6xl font-bold text-[#b8860b] drop-shadow-[0_0_10px_rgba(255,215,0,0.7)] px-8 py-4 shadow-[0_0_15px_rgba(255,255,0,0.8)] ">
                    {text}
                </div>
                {winner === null ? (
                    <div className="flex flex-row text-3xl text-[#b8860b] drop-shadow-[0_0_10px_rgba(255,215,0,0.7)] gap-2 mt-2">
                        <div>Nama</div>
                        <div> - </div>
                        <div>Alamat WP</div>
                        <div> - </div>
                        <div>Alamat OP</div>
                    </div>
                ) : (
                    <div className="flex flex-row font-bold rounded-xl text-5xl gap-2 mt-2 text-sky-100 p-8 drop-shadow-[0_0_10px_rgba(255,215,0,0.7)] bg-red-700 ">
                        <div>{winner.name}</div>
                        <div> - </div>
                        <div>{(winner.phone)}</div>
                        <div> - </div>
                        <div>{winner.unit}</div>
                    </div>
                )}
            </div>
            <div className="flex flex-col items-center w-full mt-16 gap-1">
                {winner === null ? (
                    <button
                        className="py-4 px-12 border border-black text-2xl text-white bg-blue-700 rounded-lg"
                        onClick={handleOnStartStop}
                    >
                        {run === false ? 'Start' : 'Stop'}
                    </button>
                ) : (
                    <button
                        className="py-4 px-12 border border-black text-2xl text-white bg-blue-700 rounded-lg"
                        onClick={handleOnDelete}
                    >
                        Hapus
                    </button>
                )}
                {run === false && (
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
                )}
            </div>
            <ToastContainer />
        </div>
    )
}
