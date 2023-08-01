import React, { useState, useEffect } from 'react'


const getInitialValues = (fields: any, values: any = {}) => {
  const initialValues: any = {}

    for (const fieldName of fields) {
        initialValues[fieldName] = values[fieldName] || ''
    }

    return initialValues
}


export default function useForm({ fields, validate }: any) {
    const [values, setValues] = useState<any>(getInitialValues(fields))
    const [errors, setErrors] = useState<any>({})
    const [showErrors, setShowErrors] = useState<any>({})
    const [invalid, setInvalid] = useState<boolean>(true)
    const [pristine, setPristine] = useState<boolean>(true)

    useEffect(() => {
        const errors = validate(values)
        setErrors(errors)

        if (Object.keys(errors).length) {
            setInvalid(true)
        } else {
            setInvalid(false)
        }
    }, [values])

    useEffect(() => {
        console.log('fields', getInitialValues(fields, values))
    }, [fields])

    const onChange = (fieldName: string) => (value: any) => {
        setValues({ ...values, [fieldName]: value })
    }

    const onBlur = (fieldName: string) => (value: any) => {
        if (!!values[fieldName]) {
            setShowErrors({ ...showErrors , [fieldName]: true })
        }
    }

    const addField = (fieldName: string) => {
        setValues({ ...values, [fieldName]: '' })
    }

    const removeField = (fieldName: string) => {
        const newValues = { ...values }
        delete newValues[fieldName]
        setValues(newValues)
    }

    return {
        values,
        errors,
        invalid,
        pristine,
        onChange,
        onBlur,
        showErrors,
        addField,
        removeField
    }
}
