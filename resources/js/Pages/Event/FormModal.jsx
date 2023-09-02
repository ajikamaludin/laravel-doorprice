import React, { useEffect, useRef } from 'react'
import Modal from '@/Components/Modal'
import { useForm } from '@inertiajs/react'
import Button from '@/Components/Button'
import FormInput from '@/Components/FormInput'
import { isEmpty } from 'lodash'
import FormInputDate from '@/Components/FormInputDate'
import FormFile from '@/Components/FormFile'

export default function FormModal(props) {
    const inputRef = useRef()
    const { modalState } = props
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            name: '',
            date: '',
            image: null,
            image_url: '',
        })

    const handleOnChange = (event) => {
        setData(
            event.target.name,
            event.target.type === 'checkbox'
                ? event.target.checked
                    ? 1
                    : 0
                : event.target.value
        )
    }

    const handleReset = () => {
        inputRef.current.value = ''
        modalState.setData(null)
        reset()
        clearErrors()
    }

    const handleClose = () => {
        handleReset()
        modalState.toggle()
    }

    const handleSubmit = () => {
        const event = modalState.data
        if (event !== null) {
            post(route('event.update', event), {
                onSuccess: () => handleClose(),
            })
            return
        }
        post(route('event.store'), {
            onSuccess: () => handleClose(),
        })
    }

    useEffect(() => {
        const event = modalState.data
        if (isEmpty(event) === false) {
            setData({
                name: event.name,
                date: event.date,
                image_url: event.image_url,
            })
            return
        }
    }, [modalState])

    return (
        <Modal isOpen={modalState.isOpen} toggle={handleClose} title={'Event'}>
            <FormInput
                name="name"
                value={data.name}
                onChange={handleOnChange}
                label="Nama"
                error={errors.name}
            />
            <FormInputDate
                name="date"
                selected={data.date}
                onChange={(date) => setData('date', date)}
                label="Tanggal"
                error={errors.date}
            />
            <FormFile
                inputRef={inputRef}
                label={'Gambar'}
                onChange={(e) => setData('image', e.target.files[0])}
                error={errors.image}
                preview={
                    isEmpty(data.image_url) === false && (
                        <img
                            src={data.image_url}
                            className="mb-1 max-h-32 w-full object-contain"
                            alt="preview"
                        />
                    )
                }
            />
            <div className="flex items-center">
                <Button onClick={handleSubmit} processing={processing}>
                    Simpan
                </Button>
                <Button onClick={handleClose} type="secondary">
                    Batal
                </Button>
            </div>
        </Modal>
    )
}
