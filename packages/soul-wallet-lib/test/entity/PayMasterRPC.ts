/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-09-07 11:04:54
 * @LastEditors: cejay
 * @LastEditTime: 2022-09-07 19:14:07
 */

import { UserOperation } from '../../src/exportLib/EIP4337Lib';

export class HttpPOSTRequest {
    method: 'sign' | 'send' | undefined;
    data?: UserOperation[];
    extra?: any = {};
}

export enum HttpPOSTResponseCode {
    success = 0,

    unknownError = 100,
    unknownMethodError = 101,
    unknownDataError = 102,

    dataCanNotVerifyError = 300,

    unknownPayMaster = 400,
    payMasterSignError = 401,

    bundlerError = 500,
}

export class HttpPOSTResponse {

    /**
     * 0: success, > 0: fail
     * 100:unknown error 
     * 101: unknown method
     * 102: data is empty
     * 200: data can not verify
     */
    code: HttpPOSTResponseCode = 0;
    /**
     * error message
     */
    msg: string = '';
    /**
     * any data
     */
    data: any | signData[] = {};
}
export class signData {
    succ: boolean;
    paymaster: string;
    paymasterData: string;
    error: string;
};