import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type CancelTokenSource,
} from 'axios';
import { toast } from "sonner"

// 定义后端返回数据的通用格式
export interface ResponseData<T = any> {
  code: number; // 状态码：200 成功，其他失败
  message: string; // 提示信息
  data: T; // 业务数据
}

// 定义请求配置扩展（增加自定义字段）
interface RequestConfig extends AxiosRequestConfig {
  skipErrorHandler?: boolean; // 是否跳过全局错误处理
  repeatRequestCancel?: boolean; // 是否取消重复请求（默认 true）
}

// 存储 pending 状态的请求（用于取消重复请求）
const pendingRequests = new Map<string, CancelTokenSource>();

/**
 * 生成请求唯一标识（用于判断重复请求）
 */
function generateRequestKey(config: RequestConfig): string {
  const { method, url, params, data } = config;
  return [
    method?.toUpperCase(),
    url,
    JSON.stringify(params),
    JSON.stringify(data),
  ].join('&');
}

/**
 * 取消重复请求
 */
function cancelDuplicateRequest(config: RequestConfig): void {
  const requestKey = generateRequestKey(config);
  // 如果存在重复请求，取消它
  if (pendingRequests.has(requestKey)) {
    const cancelTokenSource = pendingRequests.get(requestKey);
    cancelTokenSource?.cancel(`取消重复请求：${requestKey}`);
    pendingRequests.delete(requestKey);
  }
  // 存储当前请求的 cancelToken
  if (config.repeatRequestCancel !== false) {
    const cancelTokenSource = axios.CancelToken.source();
    config.cancelToken = cancelTokenSource.token;
    pendingRequests.set(requestKey, cancelTokenSource);
  }
}

/**
 * 移除已完成的请求（从 pending 中）
 */
function removeCompletedRequest(config: RequestConfig): void {
  const requestKey = generateRequestKey(config);
  pendingRequests.delete(requestKey);
}

// 创建 Axios 实例
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api', // 从环境变量获取 baseURL
  timeout: 10000, // 超时时间 10s
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
});

// 请求拦截器
request.interceptors.request.use(
  (config: any) => {
    // 1. 取消重复请求
    cancelDuplicateRequest(config);
    // 2. 添加 token（从 localStorage 或其他地方获取）
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 3. 其他请求处理（如添加语言、设备信息等）
    return config;
  },
  (error) => {
    // 请求发送失败处理
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response: AxiosResponse<ResponseData>) => {
    // 移除已完成的请求
    removeCompletedRequest(response.config as RequestConfig);

    const { data, config } = response;
    const { code, message } = data;

    // 1. 处理业务错误（非 200 状态码）
    if (code !== 200) {
      // 特殊错误码处理（如 token 过期）
      if (code === 401) {
        // 示例：跳转到登录页
        window.location.href = '/login';
        // 或调用 refreshToken 逻辑
      }

      // 非特殊错误且未跳过错误处理，则全局提示
      if (!(config as RequestConfig).skipErrorHandler) {
        console.error('请求错误：', message || '未知错误');
        // 可替换为 UI 库的提示（如 ElMessage.error）
      }

      return Promise.reject(new Error(message || '请求失败'));
    }

    // 2. 成功返回：直接返回 data 字段（剥离 code 和 message）
    return data.data;
  },
  (error) => {
    const { data } = error.response;
    const { code } = data;
    if (code === 401) {
      window.location.href = '/login';
      localStorage.clear()
    }
    // 移除已完成的请求（错误情况）
    if (error.config) {
      removeCompletedRequest(error.config as RequestConfig);
    }

    // 处理网络错误/超时等
    let errorMessage = '网络错误，请稍后重试';
    
    toast.error("操作失败", {
      description: error.response.data.message,
    })
    if (error.message.includes('timeout')) {
      errorMessage = '请求超时，请稍后重试';
    } else if (axios.isCancel(error)) {
      errorMessage = `请求已取消：${error.message}`;
    }

    console.error(errorMessage);

    // 可替换为 UI 库的提示（如 ElMessage.error）

    return Promise.reject(error);
  }
);

/**
 * 封装请求方法（带类型约束）
 */
const http = {
  get<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return request.get(url, config);
  },

  post<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return request.post(url, data, config);
  },

  patch<T = any>(url: string, data?: any, config?: RequestConfig): Promise<T> {
    return request.patch(url, data, config);
  },

  delete<T = any>(url: string, config?: RequestConfig): Promise<T> {
    return request.delete(url, config);
  },

  // 取消所有 pending 状态的请求
  cancelAllRequests(): void {
    pendingRequests.forEach((cancelTokenSource) => {
      cancelTokenSource.cancel('取消所有请求');
    });
    pendingRequests.clear();
  },
};

export default http;