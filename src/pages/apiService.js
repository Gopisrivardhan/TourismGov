import axios from 'axios';

// Replace 8383 with your API Gateway port (or the specific service port if bypassing the gateway)
const BASE_URL = 'http://localhost:8383/tourismgov/v1'; 

// 1. Create a configured Axios instance
const apiClient = axios.create({
    baseURL: BASE_URL,
});

// 2. Add an Interceptor to attach the JWT Token automatically to every request
apiClient.interceptors.request.use(
    (config) => {
        // Grab the token from the browser's localStorage. 
        // IMPORTANT: If you save your token under a different name during login (e.g., 'jwt' or 'accessToken'), 
        // change 'token' to match that exact string below!
        const token = localStorage.getItem('token'); 
        
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 3. Define all Compliance endpoints using the secure 'apiClient'
export const ComplianceAPI = {
    // Matches GET /tourismgov/v1/compliance/records
    getAll: async () => {
        const response = await apiClient.get(`/compliance/records?size=100&sort=createdAt,desc`);
        return response.data; 
    },
    
    // Matches POST /tourismgov/v1/compliance/records
    create: async (data) => {
        const response = await apiClient.post(`/compliance/records`, data);
        return response.data;
    },
    
    // Matches PATCH /tourismgov/v1/compliance/records/{recordId}/result?result={result}
    updateResult: async (recordId, result) => {
        const response = await apiClient.patch(`/compliance/records/${recordId}/result?result=${result}`);
        return response.data;
    }
};

// 4. Define all Audit endpoints using the secure 'apiClient'
export const AuditAPI = {
    // Matches GET /tourismgov/v1/audits/official
    getAll: async () => {
        const response = await apiClient.get(`/audits/official`);
        return response.data;
    },
    
    // Matches POST /tourismgov/v1/audits/official
    create: async (data) => {
        const response = await apiClient.post(`/audits/official`, data);
        return response.data;
    },
    
    // Matches PATCH /tourismgov/v1/audits/official/{id}
    update: async (auditId, data) => {
        const response = await apiClient.patch(`/audits/official/${auditId}`, data);
        return response.data;
    }
};