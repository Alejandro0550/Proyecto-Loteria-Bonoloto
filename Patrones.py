import json
import random

# Cargar patrones.json
try:
    with open("patrones.json", "r") as file:
        patrones = json.load(file)
except FileNotFoundError:
    print("Error: El archivo 'patrones.json' no se encuentra.")
    exit()
except json.JSONDecodeError as e:
    print(f"Error: El archivo 'patrones.json' tiene un formato inválido. {e}")
    exit()

# Cargar piramides.json
try:
    with open("piramides.json", "r") as file:
        piramides = json.load(file)
except FileNotFoundError:
    print("Error: El archivo 'piramides.json' no se encuentra.")
    exit()
except json.JSONDecodeError as e:
    print(f"Error: El archivo 'piramides.json' tiene un formato inválido. {e}")
    exit()

# Obtener la última pirámide
ultima_piramide = piramides[-1] if piramides else None
if not ultima_piramide:
    print("Error: No hay pirámides disponibles en el archivo.")
    exit()

# Convertir las filas de la última pirámide en un conjunto de números, excluyendo la primera fila
numeros_ultima_piramide = set()
for fila in ultima_piramide["filas"][1:]:  # Excluir la primera fila
    numeros_ultima_piramide.update(map(int, fila.split(", ")))

print(f"Números en la última pirámide (excluyendo la primera fila): {sorted(numeros_ultima_piramide)}")
# Filtrar los números válidos
numeros_validos = [
    {"Numero": int(patron["Numero"]), "Total": patron["Total"]}
    for patron in patrones
    if int(patron["Numero"]) in numeros_ultima_piramide
]

# Ordenar los números válidos por Total en orden descendente
numeros_validos.sort(key=lambda x: x["Total"], reverse=True)

# Generar agrupaciones de 6 números
agrupaciones = []
while len(agrupaciones) < 32:
    agrupacion = random.sample(numeros_validos, 6) if len(numeros_validos) >= 6 else random.choices(numeros_validos, k=6)
    agrupacion_numeros = [str(numero["Numero"]).zfill(2) for numero in agrupacion]  # Formatear a dos dígitos
    if agrupacion_numeros not in agrupaciones:
        agrupaciones.append(agrupacion_numeros)

# Mostrar las agrupaciones generadas en consola
print("Agrupaciones generadas:")
for i, agrupacion in enumerate(agrupaciones, start=1):
    print(f"Agrupación {i}: {agrupacion}")