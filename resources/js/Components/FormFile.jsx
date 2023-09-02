import React, { useRef } from 'react'

export default function FormFile({
    label,
    onChange,
    error,
    preview,
    inputRef = useRef(),
    help,
}) {
    return (
        <div className="my-4">
            {label !== '' && (
                <label
                    htmlFor={label}
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    {label}
                </label>
            )}
            {preview && preview}
            <input
                id={label}
                className="block w-full text-xs text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                type="file"
                onChange={onChange}
                ref={inputRef}
            />
            {help && help}
            {error && (
                <p className="mb-2 text-sm text-red-600 dark:text-red-500">
                    {error}
                </p>
            )}
        </div>
    )
}
