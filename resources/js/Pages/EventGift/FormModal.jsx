import React, { useEffect, useRef } from 'react'
import Modal from '@/Components/Modal'
import { useForm } from '@inertiajs/react'
import Button from '@/Components/Button'
import FormInput from '@/Components/FormInput'
import { isEmpty } from 'lodash'
import FormFile from '@/Components/FormFile'
import EventSelectionInput from '../Event/SelectionInput'
import SelectionInputValueText from '@/Components/SelectionInputValueText'

export default function FormModal(props) {
    const inputRef = useRef()
    const { modalState } = props
    const { data, setData, post, put, processing, errors, reset, clearErrors } =
        useForm({
            event_id: null,
            name: '',
            quota: '',
            type: 0,
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
        const gift = modalState.data
        if (gift !== null) {
            post(route('gift.update', gift), {
                onSuccess: () => handleClose(),
            })
            return
        }
        post(route('gift.store'), {
            onSuccess: () => handleClose(),
        })
    }

    useEffect(() => {
        const gift = modalState.data
        if (isEmpty(gift) === false) {
            setData({
                event_id: gift.event_id,
                name: gift.name,
                quota: gift.quota,
                type: gift.type,
                image_url: gift.image_url,
            })
            return
        }
    }, [modalState])

    return (
        <Modal isOpen={modalState.isOpen} toggle={handleClose} title={'Hadiah'}>
            <EventSelectionInput
                label="Event"
                itemSelected={data.event_id}
                onItemSelected={(item) => setData('event_id', item.id)}
                error={errors.event_id}
            />
            <FormInput
                name="name"
                value={data.name}
                onChange={handleOnChange}
                label="Nama"
                error={errors.name}
            />
            <FormInput
                type="number"
                name="quota"
                value={data.quota}
                onChange={handleOnChange}
                label="Kuota"
                error={errors.quota}
            />
            <SelectionInputValueText
                name="type"
                value={data.type}
                onChange={handleOnChange}
                label="Jenis"
                error={errors.type}
                options={[
                    { value: 0, text: 'Utama' },
                    { value: 1, text: 'Reguler' },
                ]}
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
