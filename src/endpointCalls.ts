import axios from "axios";

export const getNoParams = async (endpoint: string) => {
  try {
    const res = await axios.get(endpoint);

    if (res.status === 200) {
      return {
        response: res.data,
        errors: null,
      };
    } else {
      return {
        response: null,
        errors: res.statusText,
      };
    }
  } catch (err) {
    const error: any = err;

    if (error.response && error.response.data && error.response.errors) {
      return {
        response: null,
        errors: error.response.errors,
      };
    } else {
      return {
        response: null,
        errors: true,
      };
    }
  }
};

export const getWithParams = async (endpoint: string, params: any) => {
  try {
    const res = await axios.get(endpoint, { params });

    if (res.status === 200) {
      return {
        response: res.data,
        errors: null,
      };
    } else {
      return {
        response: null,
        errors: res.statusText,
      };
    }
  } catch (err) {
    const error: any = err;

    if (error.response && error.response.data && error.response.errors) {
      return {
        response: null,
        errors: error.response.errors,
      };
    } else {
      return {
        response: null,
        errors: true,
      };
    }
  }
};

export const postWithParams = async (endpoint: string, params: any) => {
  try {
    const res = await axios.post(endpoint, params);

    if (res.data.status === "1" || res.data.status === 200) {
      return {
        response: res.data,
        errors: null,
      };
    } else {
      return {
        response: null,
        errors: res.data.statusText,
      };
    }
  } catch (err) {
    const error: any = err;

    if (error.response && error.response.data && error.response.data.errors) {
      return {
        response: null,
        errors: error.response.data.errors,
      };
    } else {
      return {
        response: null,
        errors: true,
      };
    }
  }
};
