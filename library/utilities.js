export const axiosHeaders = (token) => {
    return {
        headers: {
            'authorization' : `bearer ${token}`
        }
    }
}