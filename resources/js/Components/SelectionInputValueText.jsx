import React from 'react'

export default function SelectionInputValueText({
    value,
    name,
    onChange,
    label = '',
    options = [],
    error,
    disabled = false,
}) {
    return (
        <>
            <div className="mb-1">
                <label
                    htmlFor={name}
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    {label}
                </label>
                <select
                    id={name}
                    name={name}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                >
                    {options.map((op) => (
                        <option value={op.value}>{op.text}</option>
                    ))}
                </select>
            </div>
            {error && (
                <p className="mb-2 text-sm text-red-600 dark:text-red-500">
                    {error}
                </p>
            )}
        </>
    )
}
