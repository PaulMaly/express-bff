import { Express, Request, Response, Handler, Locals } from 'express';
import { CompressionOptions } from 'compression';
import { Options as RoutingOptions } from 'express-file-routing';
import { HelmetOptions } from 'helmet';
import { Options as SirvOptions } from 'sirv';
import { ProxyOptions as HttpProxyOptions } from 'express-http-proxy';
import csurf from 'csurf';
import { CorsOptions } from 'cors';
import { SessionOptions as SessionMiddlewareOptions } from 'express-session';

export interface ApiOptions extends RoutingOptions {
	dir?: RoutingOptions['directory'];
	method?: (req: Request, res: Response) => string | string;
	reqId?: string;
}

export interface SecurityOptions extends HelmetOptions {
    secure?: boolean;
    cors?: CorsOptions | boolean;
    csrf?: Parameters<typeof csurf> | boolean;
}

export interface StaticOptions extends SirvOptions {
    dir?: string;
}

export interface ProxyOptions extends HttpProxyOptions {
    target: string | ((req: Request) => string);
    path?: string;
}

export interface SsrOptions {
    handler: ((req: Request) => Promise<Record<string, string>>);
    template?: string | ((req: Request) => string);
}

export interface SseOptions {
    path?: string;
    headers?: Record<string, string>; 
    statusCode?: number; 
    compress?: boolean;  
    retry?: number; 
    serializer?: Parameters<typeof JSON.stringify>[1] | ((this: any, key: string, value: any) => any);
}

export interface SessionOptions extends SessionMiddlewareOptions {
    persist?: boolean; 
    
    dir?: string;
}

export interface Options {
    security: SecurityOptions | false;
    compress: CompressionOptions | false;
    static: StaticOptions | false;
    session: SessionOptions | false;
    sse: SseOptions | false;
    middlewares: Handler[] | false;
    api: ApiOptions | false;
    proxy: ProxyOptions | false;
    ssr: SsrOptions | false;
}


export declare function bff(app: Express, options: Options): void;
