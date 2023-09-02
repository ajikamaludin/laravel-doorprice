import React from 'react'
import ApplicationLogo from '@/Components/Defaults/ApplicationLogo'
import { Link, usePage } from '@inertiajs/react'

export default function Guest({ children }) {
    const {
        props: { app_name, app_logo },
    } = usePage()

    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
            <div>
                <Link href="/">
                    <div className="flex flex-col gap-1 items-center">
                        <img
                            src={app_logo}
                            alt="app_logo"
                            className="h-24 w-24"
                        />
                        <h1 className="w-auto h-20 fill-current text-gray-500 text-5xl font-bold">
                            {app_name}
                        </h1>
                    </div>
                </Link>
            </div>

            <div className="w-full max-w-md mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    )
}
