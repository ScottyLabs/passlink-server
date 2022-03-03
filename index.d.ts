/// <reference types="express" />

/**
 * A helper class to read and store the private key of the application for
 * the Login API
 */
export class KeyStore {
  static #secretKey: string;

  /**
   * Reads the key into the KeyStore. This must be called before getting
   * the secret key.
   */
  static readKey(): void;

  /**
   * Returns the secret key previously read by the readKey() method. The
   * readKey() method must be called before this.
   *
   * @returns The secret key in the KeyStore
   */
  static getSecretKey(): string;
}

declare namespace PasslinkServer {
  interface RequestObject {
    /**
     * The URL to redirect to when the request is complete. Usually not
     * required.
     */
    redirectUrl: string,
    /**
     * True if you want to restrict the login scope to andrew.cmu.edu. Otherwise
     * all accounts through Google will work.
     */
    restrictDomain: boolean,
    /** The unique ID for your application provided by the Login API. */
    applicationId: string
  }
}

/**
 * Generates the login handler you can use in an express server. The returned
 * function is passed as the callback function in app.get(path, fn) for
 * example.
 * 
 * @param reqObj The request object to send to the Login API
 * @param secretKey The secret key of your application (for login)
 * @param asymmetric Key symmetry scheme (if you have an RSA key, then true)
 * 
 * @returns The login handler you can use for express
 */
export function generateSigningRequestHandler(
  reqObj: PasslinkServer.RequestObject,
  secretKey: string,
  asymmetric: boolean
): (_req: Express.Request, res: Express.Response) => void;
