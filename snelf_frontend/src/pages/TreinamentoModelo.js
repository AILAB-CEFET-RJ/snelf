import React from 'react'
import Navbar from '../components/navbar/Navbar'
import { Alert, Box, Button, Grid, Typography } from '@mui/material'
import { Link } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';
import {enviroment} from "../enviroment/enviroment";
import { useState, useEffect } from 'react';

//const TREINAMENTO_ENDPOINT = `${enviroment.backend_url}/treinarModelo`; 
const TREINAMENTO_ENDPOINT_TREINO = `${enviroment.backend_url}/treinar-modelo-de-verdade`;
const TREINAMENTO_ENDPOINT_STATUS = `${enviroment.backend_url}/obter-status-treinamento`;
const TREINAMENTO_ENDPOINT_PARAR_TREINO = `${enviroment.backend_url}/parar-treinamento`;

export default function TreinamentoModelo() {
        
    const [resultMessage, setResultMessage] = React.useState();
    const [isLoading, setIsLoading] = React.useState(false);
    //const [status, setStatus] = useState(null);
    
    const [statusList, setStatusList] = useState([]);

    const getStatus = async () => {
        try {
            const response = await fetch(TREINAMENTO_ENDPOINT_STATUS);
            const data = await response.json();
            setStatusList(prevList => [...prevList, data]);
        } catch (error) {
            console.error(error);
        }
    };
    
    useEffect(() => {
        const intervalId = setInterval(getStatus, 5000); // chamada à API a cada 5 segundos
        return () => clearInterval(intervalId); // limpa o intervalo ao desmontar o componente
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try{
                await fetch(TREINAMENTO_ENDPOINT_TREINO, {
                    method: "POST",
                })
                    .then(r => r.json().then(() => ({ status: r.status })))
                    .then(obj => {
                if(obj.status===200){
                    setResultMessage(<Alert variant='filled' severity='success' onClose={() => {setResultMessage()}}>Treinamento iniciado com sucesso</Alert>);
                }else{
                    setResultMessage(<Alert variant='filled' severity='error' onClose={() => {setResultMessage()}}>Ocorreu um erro no treinamento do modelo. Código {obj.status}</Alert>);
                }
                setIsLoading(false)
                getStatus();
                
            });

        } catch(e) {
            setIsLoading(false);
        }
    };

    
    async function pararTreinoSubmit(e) {
        e.preventDefault();
        setIsLoading(false);
        try {
            await fetch(TREINAMENTO_ENDPOINT_PARAR_TREINO, {
                method: "POST",
            })
                .then(r => r.json().then(() => ({ status: r.status })))
                .then(obj => {
                    // console.log(obj);
                    if (obj.status === 200) {
                        setResultMessage(<Alert variant='filled' severity='success' onClose={() => { setResultMessage(); } }>Treino parado</Alert>);
                    } else {
                        setResultMessage(<Alert variant='filled' severity='error' onClose={() => { setResultMessage(); } }>Não foi possível parar o treino. Código {obj.status}</Alert>);
                    }
                    setIsLoading(false);
                    getStatus();

                });

        } catch (e) {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <Navbar />
            {isLoading ? (<LoadingSpinner /> ) : 
            (<Box p={{ xs: 0, sm: 0, md: 3 }} height='80vh' width='130vh' m="auto">
                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        rowSpacing={1}
                        alignItems="center"
                    >
                        <Box textAlign="center">
                            <Typography variant="h4">
                                Treinamento do Modelo
                            </Typography>
                        </Box>

                        <Box textAlign="center">
                            <Typography variant="h8">
                                Clique abaixo para realizar o treinamento do modelo.
                                Recomenda-se que novos treinamentos sejam realizados
                                 a partir da importação de novos dados no banco de dados.
                            </Typography>
                        </Box>

                        <Box pt={3}>
                            <Grid item>
                                <Button component={Link} to={"/"} onClick={handleSubmit} disabled={isLoading} variant="contained">
                                    Treinar Modelo 
                                </Button>
                                &nbsp; &nbsp;
                                <Button component={Link} to={"/"} onClick={pararTreinoSubmit} disabled ={isLoading} variant="contained">
                                    Parar treinamento
                                </Button>
                                &nbsp;  &nbsp;
                                <Button component={Link} to={"/"} onClick={handleSubmit} onclodisabled={isLoading} variant="contained">
                                    Retomar treinamento 
                                </Button>
                            </Grid>
                        </Box>
                    </Grid>
                    <br></br><br></br>

                {resultMessage}

                <Box pb={5}>
                {statusList.length > 0 && (
                        <div style={{ borderRadius: "10px", padding: "10px", backgroundColor: "#B0C4DE" }}>
                            <Typography variant="h6">Status:</Typography>
                            <br></br>
                            {statusList.slice(-3).map((status, index) => (
                                <Typography key={index} variant="body1">{status}</Typography>
                            ))}
                        </div>
                    )}
                        
                </Box>
            </Box>
            )}
        </div>
    );
}
