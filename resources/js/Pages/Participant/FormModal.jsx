import React, { useEffect } from 'react'
import Modal from '@/Components/Modal'
import { useForm } from '@inertiajs/react'
import Button from '@/Components/Button'
import FormInput from '@/Components/FormInput'
import { isEmpty } from 'lodash'
import EventSelectionInput from '../Event/SelectionInput'

export default function FormModal(props) {
    const { modalState } = props
    const { data, setData, post, processing, errors, reset, clearErrors } =
        useForm({
            event_id: null,
            employee_code: '',
            name: '',
            phone: '',
            email: '',
            unit: '',
            agency: '',
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
        modalState.setData(null)
        reset()
        clearErrors()
    }

    const handleClose = () => {
        handleReset()
        modalState.toggle()
    }

    const handleSubmit = () => {
        const participant = modalState.data
        if (participant !== null) {
            post(route('participant.update', participant), {
                onSuccess: () => handleClose(),
            })
            return
        }
        post(route('participant.store'), {
            onSuccess: () => handleClose(),
        })
    }

    useEffect(() => {
        const participant = modalState.data
        if (isEmpty(participant) === false) {
            setData({
                event_id: participant.event_id,
                employee_code: participant.employee_code,
                name: participant.name,
                phone: participant.phone,
                email: participant.email,
                unit: participant.unit,
                agency: participant.agency,
            })
            return
        }
    }, [modalState])

    return (
        <Modal
            isOpen={modalState.isOpen}
            toggle={handleClose}
            title={'Peserta'}
        >
            <EventSelectionInput
                label="Event"
                itemSelected={data.event_id}
                onItemSelected={(item) => setData('event_id', item.id)}
                error={errors.event_id}
            />
            <FormInput
                name="employee_code"
                value={data.employee_code}
                onChange={handleOnChange}
                label="NP"
                error={errors.employee_code}
            />
            <FormInput
                name="name"
                value={data.name}
                onChange={handleOnChange}
                label="Nama"
                error={errors.name}
            />
            <FormInput
                name="phone"
                value={data.phone}
                onChange={handleOnChange}
                label="No Telp"
                error={errors.phone}
            />
            <FormInput
                name="email"
                value={data.email}
                onChange={handleOnChange}
                label="Email"
                error={errors.email}
            />
            <FormInput
                name="unit"
                value={data.unit}
                onChange={handleOnChange}
                label="Unit Kerja"
                error={errors.unit}
            />
            <FormInput
                name="agency"
                value={data.agency}
                onChange={handleOnChange}
                label="Instansi"
                error={errors.agency}
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
