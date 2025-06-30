import { createContext, useContext } from "react";


type GetDataContextType = {
    reloadData: () => void;
    data: {}
}

const GetDataContext = createContext<GetDataContextType | undefined>(undefined);

export function useGetData() {

    const context = useContext(GetDataContext)

    if (!context) {
        throw new Error("useGetData necesita ser utilizado dentro de context")
    }
    return context
}

export default function GetDataProvider({ children }: { children: React.ReactNode }) {

    const reloadData = () => {


        ////console.log(tokenOptions)

        setSpinner(true)
        //console.log('to true')


        axios.get('api/comanda/all/comandas', tokenOptions)
            .then(res => {

                if (res.data.length === 0) {
                    setSpinner(false)
                    //console.log('toFalse')
                    setComandas([])
                    setComandasFiltradas([])
                    return
                }

                // //console.log(res.data)

                for (let x = 0; x < res.data.length; x++) {

                    // console.log(res.data[x])

                    for (let i = 0; i < res.data[x].data.length; i++) {

                        var tiposUnicos = res.data[x].data[i].productos.reduce((acc, item) => {

                            // console.log(acc, item.producto)

                            if (!acc.some(el => el.movcmdpkt === item.movcmdpkt)) {
                                // console.log('pushing', res.data)
                                // console.log('pushing', item)
                                // console.log('pushing', item.movcmdpkt, item.nompaquete)
                                acc.push({ movcmdpkt: item.movcmdpkt, nompaquete: item.nompaquete });
                            }
                            return acc;
                        }, []);

                    }
                    res.data[x].tiposUnicosInfo = tiposUnicos
                    // console.log(tiposUnicos.length)
                }



                setSpinner(false)
                //console.log('toFalse')
                setComandas(res.data)
                setComandasFiltradas(res.data)
                getCentrosYBarras(res.data)
            })
            .catch(err => {
                setSpinner(false)
                //console.log('toFalse')
                ////console.log(err)
            })

    }


    return (
        
    )
}