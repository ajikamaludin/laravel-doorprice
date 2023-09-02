import { usePage } from '@inertiajs/react'
import React from 'react'

export default function ApplicationLogo({ className }) {
    const {
        props: { app_name, app_logo },
    } = usePage()

    return (
        <div className="flex flex-row gap-1 items-center">
            <img src={app_logo} alt="app_logo" className="h-12 w-12" />
            <h1 className={className}>{app_name}</h1>
        </div>
    )
}
