import { FiPlusSquare } from 'react-icons/fi';

import logoImg from '../../assets/logo.svg';

import { Container } from './styles';

interface HeaderProps {
  openModal: () => void;
}

export function Header({ openModal }: HeaderProps) {
  return (
    <Container>
      <header>
        <img src={logoImg} alt="GoRestaurant" />
        <nav>
          <div>
            <button
              type="button"
              onClick={openModal}
            >
              <div className="text">Novo Prato</div>
              <div className="icon">
                <FiPlusSquare size={24} />
              </div>
            </button>
          </div>
        </nav>
      </header>
    </Container>
  )
}