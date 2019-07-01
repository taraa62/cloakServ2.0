//**** Nginx*/

/** for nginx.config.json
 * for all our domain
 * */

export interface INginxConfig {
    isOffRewriteAll: boolean;
    defForNewConfigs: IItemNginxConfig;
    item: IItemNginxConfig[];

}

export interface IItemNginxConfig {
    host: string;
    isRewriteConfigNginx: boolean;
    typeConfig: string
}


/** This is the interface for setting the task to generate the nginx config */
export interface IItemConfigNginx {
    nameConfig: string;
    domain: string;
    isRewrite: boolean;
    protocolServer: string;
    nameServerConfD: string;
    pathToResource: string;
    sslSertificate?: string;
    sslSertificateKey?: string;
}

/**
 * config for default configs for replace
 */
export interface IConfigNginx {
    name: string;
    config: string;
}
