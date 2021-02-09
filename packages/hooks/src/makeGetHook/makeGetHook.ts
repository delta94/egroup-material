import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import queryString, { StringifiableRecord } from 'query-string';
import replacer from '@e-group/utils/replacer';
import objectCheckNull from '@e-group/utils/objectCheckNull';
import useSWR, { ConfigInterface } from 'swr';
import { PathParams, ReturnedValues } from '../typings';

export default function makeGetHook<T = any, P = PathParams, E = any>(
  urlPattern: string,
  fetcher: AxiosInstance
) {
  return function useItem<Data = T, ErrorData = E>(
    params?: P,
    payload?: StringifiableRecord,
    config?: ConfigInterface<AxiosResponse<Data>, AxiosError<ErrorData>>
  ): ReturnedValues<Data, ErrorData> {
    const query = payload ? `?${queryString.stringify(payload)}` : '';
    const getKey = () => {
      if (params) {
        return !objectCheckNull(params)
          ? `${replacer<P>(urlPattern, params)}${query}`
          : null;
      }
      return `${urlPattern}${query}`;
    };
    const { error, data, mutate } = useSWR(getKey(), fetcher, config);

    return {
      data: data?.data,
      isLoading: !error && !data,
      isError: !!error,
      mutate,
      response: data,
      error,
    };
  };
}