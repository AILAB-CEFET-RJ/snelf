import { Alert, Box, Button, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import Navbar from '../components/navbar/Navbar'
import { Link } from 'react-router-dom';
import { useState } from 'react';


const CONSULTA_ENDPOINT = `http://localhost:8000/consultarGrupo`;

export default function Busca() {
    const [search, setSearch] = useState('');
    const [result, setResult] = useState([]);
    const [resultMessage, setResultMessage] = React.useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let formData = new FormData();
        formData.append("stringBusca", search);
        await fetch(CONSULTA_ENDPOINT, {
            method: "POST",
            body: search,
        })
        .then(r => r.json().then(data => ({ status: r.status, body: data })))
        .then(responseData => {
            setResult([]);
            console.log(responseData.body);

            for (const key in responseData.body) {
                let transacao = responseData[key].name.toLowerCase();
                setResult(previousResult => {
                    return [...previousResult, responseData[key]]
                });
            }


            if(responseData.status===200){
                setResultMessage(<Alert variant='filled' severity='success' onClose={() => {setResultMessage()}}>Consulta realizada com sucesso: Grupo - {responseData.body}.</Alert>);
            }else{
                setResultMessage(<Alert variant='filled' severity='error' onClose={() => {setResultMessage()}}>Ocorreu um erro na consulta. Código {responseData.status}</Alert>);
            }
        }).catch(error => {
            console.log(error);
        });
    };

    return (
        <div>
            <Navbar />
            <Box p={{ xs: 8, sm: 6, md: 9 }} height='80vh' width='80vh' m="auto">
                <Box pb={5}>
                    <Grid
                        container
                        spacing={0}
                        direction="column"
                        rowSpacing={1}
                        alignItems="center"
                    >
                        <Box pt={5} pb={1} textAlign="center">
                            <Typography variant="h3">
                                Busca
                            </Typography>
                        </Box>

                        <Box p={2} pb={8} textAlign="center">
                            <Typography variant="h8">
                                Digite o nome do produto desejado:
                            </Typography>
                        </Box>

                        <TextField onChange={(event) => setSearch(event.target.value)} fullWidth label="Insira o nome do produto" id="fullWidth" />

                        <Box pt={7}>
                            <Grid item>
                                <Button component="label" type="submit" onClick={handleSubmit} variant="contained">
                                    Buscar
                                </Button>
                            </Grid>
                        </Box>

                    </Grid>
                </Box>
            </Box>
        </div>
    )
}
