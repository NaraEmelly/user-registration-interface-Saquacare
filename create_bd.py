# criando banco de dados
import sqlite3

dados = sqlite3.connect('database.db')
cursor = dados.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS usuarios (
   id INTEGER PRIMARY KEY AUTOINCREMENT,
   nome TEXT NOT NULL,
   cpf INTEGER UNIQUE NOT NULL
   sus INTERGER UNIQUE NOT NULL
   senha TEXT NOT NULL            
               )
''')
# sqlite3.OperationalError: near "sus": syntax error >> corrigir depois
dados.commit()
dados.close()
print('Banco Criado')
