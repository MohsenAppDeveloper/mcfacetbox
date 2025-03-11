import { GateProperties } from "@/types/gate";
import { FetchError } from "ofetch";

export const gateAdd = async (gateModel: GateProperties, serviceUrl: string) => {
    const data = ref(null)
    const error = ref(null)
    await $api()(serviceUrl, {
        method: 'POST',
        body: gateModel,
        ignoreResponseError: false
    }).then((responce) => {
        console.log('addsuccess', responce.body);
    }, (error) => {
        const temp = (error as FetchError)
        console.log('adderror', temp.statusCode, temp.message, temp.name);
    }).catch((error) => {
        console.log('addusercatch', error.data);
    })
}
