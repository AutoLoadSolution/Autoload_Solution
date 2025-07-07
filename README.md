# Merging Odoo

![Odoo](https://img.shields.io/badge/Odoo-17-875A7B.svg)
![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## 🚀 Overview


## ✨ Features


## 🛠️ Tech Stack

- **Backend**: Odoo 17 (Python)
- **Database**: PostgreSQL 15
- **Frontend**: Odoo Web Client
- **Deployment**: Docker Compose
- **Architecture**: MVC Pattern

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- 4GB+ RAM
- 2GB+ disk space
~
### Installation

1. **Clone the repository**

```bash
git clone https://github.com/AutoLoadSolution/odoo_FE.git
cd merging_docker
```

2. **Start the services**

```bash
cd merging_docker
docker-compose up -d
```

3. **Access the application**

- URL: <http://localhost:8069>
- Username: `admin`
- Password: `admin`

4. **Install the module**

- Go to Apps → Update Apps List
- Search for "my_app"
- Click Install

## 📖 Usage

### Managing Products

1. Navigate to **Gestion Magasin** → **Produits**
2. Click **Create** to add new products
3. Set pricing and descriptions

### Processing Orders

1. Go to **Gestion Magasin** → **Commandes**
2. Create new orders and add products
3. Use workflow buttons: Confirm → Deliver
4. Generate PDF reports with the Print button

### User Management

1. Access **Settings** → **Users & Companies**
2. Assign roles: Sales Staff or Manager
3. Configure permissions per role

## 🏗️ Architecture

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Client    │    │   Odoo Server   │    │   PostgreSQL    │
│   (Frontend)    │◄──►│   (Backend)     │◄──►│   (Database)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │
                    ┌─────────────────┐
                    │  Custom Module  │
                    │ Odoo-Ecommerce-Manager │
                    └─────────────────┘
```

## 🔧 Development

### Project Structure

```tree
dossier_docker/Odoo-Ecommerce-Manager/
├── models/          # Business logic
│   ├── produit.py   # Product model
│   └── commande.py  # Order model
├── views/           # UI definitions
│   ├── produit_view.xml
│   ├── commande_view.xml
│   └── menu.xml
├── security/        # Access rights
│   ├── security.xml
│   └── ir.model.access.csv
├── data/           # Default data
│   ├── sequence.xml
│   └── rapport.xml
└── __manifest__.py # Module definition
```

### Key Models

#### **Product Model (`gestion.produit`)**

- Name, description, price fields
- Category management
- Inventory tracking

#### **Order Model (`gestion.commande`)**

- Customer relationship
- Product selection (Many2many)
- Workflow states: Draft → Confirmed → Delivered
- Automatic total calculation
- PDF report generation

### Adding Features

1. Create models in `models/`
2. Define views in `views/`
3. Set permissions in `security/`
4. Update `__manifest__.py`


## 📋 Business Logic

### Order Workflow

1. **Draft**: Initial state, editable
2. **Confirmed**: Order validated, ready for processing
3. **Delivered**: Order completed
4. **Cancelled**: Order cancelled

### Automatic Features

- **Sequential numbering** for orders
- **Real-time total calculation**
- **Mail thread integration** for communication
- **PDF report generation**

## 🐳 Docker Deployment

```bash
# Start all services
docker-compose up -d

# View logs
docker logs odoo

# Restart Odoo only
docker restart odoo

# Stop all services
docker-compose down
```

## 📸 Screenshots

| Feature | Description |
|---------|-------------|
| Dashboard | Main navigation and overview |
| Products | Product catalog management |
| Orders | Order processing workflow |
| Reports | PDF generation system |

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

**Main Developer:**
[@thejokers69](https://github.com/thejokers69)

**Contributors:**
- **Houssam AOUN** - [@AuroreTBF](https://github.com/AuroreTBF) - Co-developer and project contributor

- GitHub: [@thejokers69](https://github.com/thejokers69)
- Project: [Odoo-Ecommerce-Manager](https://github.com/thejokers69/Odoo-Ecommerce-Manager)

## 🙏 Acknowledgments

- Odoo Community for the excellent framework
- Docker team for containerization tools
- PostgreSQL for robust database management

---
⭐ **Star this repository if it helped you!**
