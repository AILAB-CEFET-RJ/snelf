from http.client import HTTPException
from fastapi import Body, FastAPI, File, UploadFile, Query, Request
from fastapi.middleware import Middleware
# from starlette.middleware.cors import CORSMiddleware
from fastapi.middleware.cors import CORSMiddleware
from pre_processamento import inicia_pre_processamento
import fasttext 
from importar_csv_para_sql import fill_db_tables, insert_transactions, get_medicines_from_label, getTransactionsFromClean, get_transactions_from_product
import pdb
import unittest
import numpy as np


app = FastAPI(debug=True)

#rota de importação do csv. estudando como fazer para upload em csv maior
@app.post("/importarCsv")
async def importarCsv(csvFile: UploadFile = File(...)):
    if csvFile.filename.endswith('.csv'):
        #modifica o csv para formato que é aceito no treinamento
        # cleaned_dataset = clean_dataset(csvFile)
        #aqui seria a chamada para a api do modelo, iniciando o pré processamento
        await inicia_pre_processamento(csvFile)
        fasttext.supervised('dados/data.train.txt','modelo/modelo')
        return {"filename": csvFile.filename, "status":"Arquivo recebido na API de importação"}
    else:
        raise HTTPException(status_code=422, detail="Formato de arquivo não suportado")

@app.post("/treinarModelo")
def treinamentoModelo():
    try:
        fill_db_tables()
        # await inicia_pre_processamento()
        # fasttext.supervised('dados/data.train.txt','modelo/modelo')
        return {"status":"Treinamento do modelo realizado com sucesso."}
    except Exception as e:
        print(e)
        raise HTTPException(status_code=422, detail="Modelo não pôde ser treinado.")

@app.post("/consultarGrupo")
async def consultaGrupo(busca: str = Body(...)):
    try:
        array_from_product = get_transactions_from_product(busca)
        transactions = array_from_product
        
        model = fasttext.load_model("modelo/modelo.bin")
        label = model.predict_proba([busca],k=1)[0][0][0]
        
        array_from_prediction = get_medicines_from_label(label)
        # transactions = array_from_product + array_from_prediction[0:100]

        print(label)
        print(transactions)
        return { 'medicines': transactions }

    except Exception as e:
        print(e)
        raise HTTPException(status_code=422, detail="Consulta não pôde ser realizada.")

@app.post("/consultarClean")
async def consultaClean(busca: str = Body(...)):
    try:
        transactions = getTransactionsFromClean(busca)
        print(len(transactions))
        return { 'medicines': transactions }
    except Exception as e:
        print(e)
        raise HTTPException(status_code=422, detail="Consulta não pôde ser realizada.")

# rota de importação do csv. estudando como fazer para upload em csv maior
# @app.post("/importarMedicamentos")
# async def importarMedicamentos(csvFile: UploadFile = File(...)):
#     if csvFile.filename.endswith('.csv'):
#         insert_medicine(csvFile)
#         return {"filename": csvFile.filename, "status":"Arquivo importado com sucesso."}
#     else:
#         raise HTTPException(status_code=422, detail="Formato de arquivo não suportado")

@app.get("/teste")
async def root():
    return "Teste executado com sucesso."

@app.post("/importarTransacoes")
async def importarTransacoes(csvFile: UploadFile = File(...)):
    if csvFile.filename.endswith('.csv'):
        insert_transactions(csvFile)
        return {"filename": csvFile.filename, "status":"Arquivo importado com sucesso."}
    else:
        raise HTTPException(status_code=422, detail="Formato de arquivo não suportado")




#burlando cors
app = CORSMiddleware(
    app=app,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)