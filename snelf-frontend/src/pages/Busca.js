import { Box, Button, Grid, TextField, Typography } from '@mui/material'
import React from 'react'
import Navbar from '../components/navbar/Navbar'
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Busca() {
    const [search, setSearch] = useState({});

    function handleChange(e) {
        setSearch({...search, [e.target.name]: e.target.value});
    }

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

                        <TextField fullWidth label="Insira o nome do produto" id="fullWidth" />



                        <Box pt={7}>
                            <Grid item>
                                <Button component={Link} to="/resultado" variant="contained">
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
