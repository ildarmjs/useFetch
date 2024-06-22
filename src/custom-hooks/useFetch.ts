import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface FetchOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
	params?: Record<string, string | undefined>;
	headers?: Record<string, string>;
}
interface Item {
	id: number,
	title: string,
	body: string,
	userId: number,
}

interface FetchResult {
	data: Item[];
	isLoading: boolean;
	error: any;
	refetch: (options?: FetchOptions) => Promise<void>;
}

const useFetch = (url: string): FetchResult => {
	const [data, setData] = useState<any>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<any>(null);

	const fetch = useCallback(
		(limit?: number) => {
			setIsLoading(true);

			axios
				.get(url)
				.then((response) => {
					if (limit) {
						setData(response.data.slice(0, limit));
					} else {
						setData(response.data);
					}
					setIsLoading(false);
				})
				.catch((error) => {
					setError(error);
					setIsLoading(false);
				});
		},
		[url]
	);

	const refetch = async (params: FetchOptions = {}): Promise<void> => {
		setError(null);
		const limit = params.params?._limit ? parseInt(params.params._limit) : undefined;
		await fetch(limit);
	};

	useEffect(() => {
		fetch();
	}, [fetch]);

	return { data, isLoading, error, refetch };
};

export default useFetch;