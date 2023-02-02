/*
 * @Description: 
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-09-21 09:33:21
 * @LastEditors: cejay
 * @LastEditTime: 2022-09-21 15:27:47
 */
export interface Ret_put {
    /**
     * 0: success
     * 1: fail
     * 2: server error: nonce error
     * 3: nonce too low
     * 4: current chain not support EIP1559
     * 5: gas too low
     * 6: bundler server not ready 
     */
    code: number;
    msg: string;
    requestId: string;
}

export interface Ret_get {
    /**
     * 0:pending
     * 1:replaced
     * 2:processing
     * 3:success
     * 4:fail
     * 5:notfound
     */
    code: number;
    msg: string;
    requestId: string;
    txHash: string;
}
