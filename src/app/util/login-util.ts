export class LoginUtil {

    static getJSessionId(response): string {
        let header = response.headers.find(header => header.name === 'AppendToGatewayUrl');

        if (!header) {
            return null;
        }

        return header.data;
    }

}
