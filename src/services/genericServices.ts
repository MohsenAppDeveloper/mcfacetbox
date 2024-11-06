import { FetchError } from "ofetch";

export async function serviceAdd<T extends BodyInit | Record<string, any>>(dataModel: T, serviceUrl: string) {
    const serviceData = ref(0)
    const serviceError = ref('')
    try {

        await $api(serviceUrl, {
            method: 'POST',
            body: JSON.parse(JSON.stringify(dataModel)),
            ignoreResponseError: false
        }).then((response) => {
            serviceData.value = response.body
        }, (error) => {
            const temp = (error as FetchError)
            serviceError.value = temp.message
        }).catch((error) => {
            serviceError.value = error.data
        })
    } catch (error) {
        serviceError.value = 'error'
    }
    return { serviceData, serviceError }
}

export async function serviceUpdate<T extends BodyInit | Record<string, any>>(dataModel: T, entityId: number, serviceUrl: string) {
    const serviceData = ref(0)
    const serviceError = ref('')
    try {
        await $api((serviceUrl + "/").replace("//", "/") + entityId, {
            method: 'PUT',
            body: JSON.parse(JSON.stringify(dataModel)),
            ignoreResponseError: false
        }).then((responce) => {
            serviceData.value = responce.body
        }, (error) => {
            const temp = (error as FetchError)
            serviceError.value = temp.message
        }).catch((error) => {
            serviceError.value = error.data
        })
    } catch (error) {
        serviceError.value = 'error'
    }
    return { serviceData, serviceError }
}

export async function serviceDelete(id: number, serviceUrl: string) {
    const serviceData = ref()
    const serviceError = ref()

    await $api((serviceUrl + "/").replace("//", "/") + id, {
        method: 'DELETE', parseResponse: JSON.parse,
        onResponse({ request, response, options }) {
            serviceData.value = response
            // console.log("[fetch response]", request, response.status, response._data.body);
        }, onResponseError({ response }) {
            serviceError.value = response._data.errors
        }
    }
    ).catch((error) => {
        serviceError.value = error.data
    })
    return { serviceData, serviceError }
}
