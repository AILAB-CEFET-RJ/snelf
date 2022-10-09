from http.client import HTTPException
from fastapi import FastAPI, File, UploadFile
from starlette.middleware.cors import CORSMiddleware
from pre_processamento import inicia_pre_processamento
import fasttext 


app = FastAPI()

#burlando cors
origins = [
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

#rota de importação do csv. estudando como fazer para upload em csv maior
@app.post("/importarCsv")
async def importarCsv(csvFile: UploadFile = File(...)):
    if csvFile.filename.endswith('.csv'):
        #modifica o csv para formato que é aceito no treinamento
        #cleaned_dataset = clean_dataset(csvFile)
        #aqui seria a chamada para a api do modelo, iniciando o pré processamento
        await inicia_pre_processamento(csvFile)
        fasttext.supervised('dados/data.train.txt','modelo/modelo')
        return {"filename": csvFile.filename, "status":"Arquivo recebido na API de importação"}
    else:
        raise HTTPException(status_code=422, detail="Formato de arquivo não suportado")

@app.get("/teste")
async def root():
    return "Teste executado com sucesso."

@app.get("/teste2")
async def root():
    return "Teste 2 executado com sucesso."
