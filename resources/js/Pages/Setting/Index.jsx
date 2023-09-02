import React, { useRef } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import FormInput from '@/Components/FormInput'
import Button from '@/Components/Button'
import { Head, router, useForm, usePage } from '@inertiajs/react'
import TextArea from '@/Components/TextArea'
import { isEmpty } from 'lodash'
import FormFile from '@/Components/FormFile'

const extractValue = (set, key) => {
    const find = set.find((s) => s.key === key)
    if (isEmpty(find) === false) {
        if (find.type === 'image') {
            return find?.url
        }
        return find?.value
    }
    return ''
}

const Profile = () => {
    const {
        props: {
            auth: { user },
        },
    } = usePage()
    const { data, setData, post, processing, errors } = useForm({
        username: user.email,
        password: '',
        password_confirmation: '',
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

    const handleSubmit = () => {
        post(route('setting.profile'), {
            onSuccess: () => {
                setTimeout(() => router.get(route(route().current())), 1500)
            },
        })
    }

    return (
        <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col">
            <FormInput
                name="username"
                value={data.username}
                onChange={handleOnChange}
                label="Username"
                error={errors.username}
            />
            <FormInput
                type="password"
                name="password"
                value={data.password}
                onChange={handleOnChange}
                label="Password"
                error={errors.password}
            />
            <FormInput
                type="password"
                name="password_confirmation"
                value={data.password_confirmation}
                onChange={handleOnChange}
                label="Confirm Password"
                error={errors.password_confirmation}
            />
            <div className="mt-2">
                <Button onClick={handleSubmit} processing={processing}>
                    Simpan
                </Button>
            </div>
        </div>
    )
}

export default function Setting(props) {
    const { setting } = props

    const inputRef = useRef()

    const { data, setData, post, processing, errors } = useForm({
        app_name: extractValue(setting, 'app_name'),
        text_footer: extractValue(setting, 'text_footer'),
        image: null,
        image_url: extractValue(setting, 'app_logo'),
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

    const handleSubmit = () => {
        post(route('setting.update'), {
            onSuccess: () => {
                setTimeout(() => router.get(route(route().current())), 1500)
            },
        })
    }

    return (
        <AuthenticatedLayout
            auth={props.auth}
            errors={props.errors}
            flash={props.flash}
            page={'Setting'}
            action={''}
        >
            <Head title="Setting" />

            <div>
                <div className="mx-auto sm:px-6 lg:px-8">
                    <div className="overflow-hidden p-4 shadow-sm sm:rounded-lg bg-white dark:bg-gray-800 flex flex-col mb-2">
                        <div className="text-xl font-bold mb-4">Setting</div>
                        <FormFile
                            inputRef={inputRef}
                            label={'Logo Aplikasi'}
                            onChange={(e) =>
                                setData('image', e.target.files[0])
                            }
                            error={errors.image}
                            preview={
                                isEmpty(data.image_url) === false && (
                                    <img
                                        src={data.image_url}
                                        className="mb-1 max-h-32 object-contain"
                                        alt="preview"
                                    />
                                )
                            }
                        />
                        <FormInput
                            name="app_name"
                            value={data.app_name}
                            onChange={handleOnChange}
                            label="Nama Aplikasi"
                            error={errors.app_name}
                        />
                        <FormInput
                            name="text_footer"
                            value={data.text_footer}
                            onChange={handleOnChange}
                            label="Text Footer"
                            error={errors.text_footer}
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

                    <Profile />
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
