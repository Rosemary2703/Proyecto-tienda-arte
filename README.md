# 🖼️ Tienda de Arte - Proyecto con React + Supabase

Una tienda en línea de obras de arte, desarrollada con **React + Vite** en el frontend y **Supabase** como backend (Base de datos + Autenticación + Storage).

---

## 🚀 Características principales

- 🔐 Autenticación con Supabase (usuarios registrados)
- 🛒 Carrito de compras persistente (localStorage)
- 🧾 Sistema de pedidos (`orders`, `order_items`)
- 🖼️ Catálogo de pinturas con calificación por estrellas
- 🧑‍🎨 Administración de productos (solo para administradores)
- 🗄️ Control de acceso con **RLS (Row Level Security)** y políticas Supabase

---

## ⚙️ Instalación local

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/Rosemary2703/Proyecto-tienda-arte.git
cd Proyecto-tienda-arte
npm install
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_anon_key
Proyecto-tienda-arte/
├── src/
│   ├── components/         # Componentes de interfaz
│   ├── context/            # Contextos: AuthContext, CartContext
│   ├── pages/              # Páginas principales
│   ├── supabaseClient.js   # Conexión con Supabase
│   └── main.jsx
│
├── supabase/
│   ├── schema.sql          # Tablas y relaciones
│   ├── rls_policies.sql    # RLS y políticas
│   └── seed.sql            # Datos iniciales (semilla)
│
├── .gitignore
├── package.json
├── README.md
└── vite.config.js
create table users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  role text default 'user'
);

create table artworks (
  id bigint generated always as identity primary key,
  title text not null,
  description text,
  image_url text,
  price numeric(10,2) not null,
  stock integer default 1,
  rating numeric(2,1)
);

create table orders (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id),
  total numeric(10,2),
  status text default 'pending',
  created_at timestamp default now()
);

create table order_items (
  id bigint generated always as identity primary key,
  order_id bigint references orders(id),
  product_id bigint references artworks(id),
  quantity integer not null,
  unit_price numeric(10,2) not null
);
-- Habilitar RLS
alter table orders enable row level security;
alter table order_items enable row level security;
alter table artworks enable row level security;

-- Solo usuarios autenticados pueden insertar pedidos
create policy "usuarios pueden insertar pedidos propios"
on orders
for insert
to authenticated
with check (auth.uid() = user_id);

-- Solo el dueño del pedido puede ver sus órdenes
create policy "usuarios pueden ver sus propios pedidos"
on orders
for select
to authenticated
using (auth.uid() = user_id);

-- Permitir insertar ítems de pedidos propios
create policy "usuarios pueden insertar detalles de sus pedidos"
on order_items
for insert
to authenticated
with check (
  exists (
    select 1 from orders o
    where o.id = order_id and o.user_id = auth.uid()
  )
);

-- Todos pueden ver artworks
create policy "artworks visibles para todos"
on artworks
for select
to public;
insert into artworks (title, description, image_url, price, stock, rating)
values
('Paisaje de Montaña', 'Acrílico sobre lienzo', 'https://example.com/montana.jpg', 120.00, 3, 4.5),
('Atardecer Marino', 'Óleo sobre tela', 'https://example.com/mar.jpg', 150.00, 2, 5.0),
('Retrato Abstracto', 'Técnica mixta', 'https://example.com/retrato.jpg', 95.00, 5, 4.2);
| Rol     | Descripción                                |
| ------- | ------------------------------------------ |
| `admin` | Puede agregar, editar y eliminar obras     |
| `user`  | Puede registrarse, comprar y dejar reseñas |

