from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import os
from flask_cors import CORS 

# Configuração do app Flask
app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False
CORS(app) 
basedir = os.path.abspath(os.path.dirname(__file__))

# Configuração do banco de dados SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'database', 'database.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Inicializar SQLAlchemy
db = SQLAlchemy(app)

# Modelo de Usuário - COM OS CAMPOS DO FRONTEND
class Usuario(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nome_completo = db.Column(db.String(100), nullable=False)
    cpf = db.Column(db.String(14), unique=True, nullable=False)  # CPF
    numero_sus = db.Column(db.String(20), unique=True, nullable=False)  # Número do SUS
    senha = db.Column(db.String(200), nullable=False)
    data_criacao = db.Column(db.DateTime, default=datetime.utcnow)

# Rota simples para testar se o servidor está funcionando
@app.route('/')
def home():
    return jsonify({
        'mensagem': 'API do SaquaCare Operacional!',
        'status': 'OK'
    })

# Rota de saúde da API
@app.route('/api/health')
def health_check():
    return jsonify({'status': 'healthy', 'timestamp': datetime.utcnow().isoformat()})

# Rota para cadastrar usuário - COM OS CAMPOS CORRETOS
@app.route('/api/usuarios', methods=['POST'])
def criar_usuario():
    try:
        data = request.get_json()
        
        # Verificar se CPF já existe
        if Usuario.query.filter_by(cpf=data['cpf']).first():
            return jsonify({'erro': 'CPF já cadastrado'}), 400
        
        # Verificar se Número SUS já existe
        if Usuario.query.filter_by(numero_sus=data['numero_sus']).first():
            return jsonify({'erro': 'Número do SUS já cadastrado'}), 400
        
        # Hash da senha
        senha_hash = generate_password_hash(data['senha'])
        
        novo_usuario = Usuario(
            nome_completo=data['nome_completo'],
            cpf=data['cpf'],
            numero_sus=data['numero_sus'],
            senha=senha_hash
        )
        
        db.session.add(novo_usuario)
        db.session.commit()
        
        return jsonify({
            'id': novo_usuario.id,
            'nome_completo': novo_usuario.nome_completo,
            'cpf': novo_usuario.cpf,
            'numero_sus': novo_usuario.numero_sus,
            'mensagem': 'Usuário criado com sucesso!'
        }), 201
        
    except Exception as e:
        return jsonify({'erro': str(e)}), 400

# Rota para listar usuários - COM OS CAMPOS CORRETOS
@app.route('/api/usuarios', methods=['GET'])
def listar_usuarios():
    usuarios = Usuario.query.all()
    resultado = []
    for usuario in usuarios:
        resultado.append({
            'id': usuario.id,
            'nome_completo': usuario.nome_completo,
            'cpf': usuario.cpf,
            'numero_sus': usuario.numero_sus,
            'data_criacao': usuario.data_criacao.isoformat()
        })
    return jsonify(resultado)

if __name__ == '__main__':
    print("Iniciando servidor Flask...")
    print("Banco de dados: SQLite")
    print("URL: http://localhost:5000")
    print("Para parar o servidor: Ctrl+C")
    
    with app.app_context():
        db.create_all()  # Cria as tabelas
    
    app.run(debug=True, port=5000)
