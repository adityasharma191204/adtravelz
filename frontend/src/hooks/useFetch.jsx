import { useEffect, useState } from 'react'

const useFetch = (url) => {
  const [apiData, setApiData] = useState();
    const [error, setError] = useState()
  
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log(url);
                const response = await fetch(url)
                
                if(!response.ok){
                    setError('failed to fetch') 
                    // toast.error(error)           
                }
        
                const result = await response.json()
                console.log(result);
                setApiData(result.data)
                
            } catch (error) {
                console.log(error);
            }
          }

          fetchData();
    }, [url])
  
    return {apiData, error}
}

export default useFetch
