import { useEffect, useState } from 'react';

export function App() {
    return <MemoryGame />;
}

const BOARD = {
    WIDTH: 6,
    HEIGHT: 6,
    SIZE: 36
}

function MemoryGame() {

    const [board, setBoard] = useState([]);
    const [solved, setSolved] = useState([]);
    const [opened, setOpened] = useState(null);

    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    const createBoard = () => {
        const numbers = [];
        for (let i = 0; i < BOARD.SIZE/2; i++) {
            numbers.push(i + 1);
            numbers.push(i + 1);
        }

        shuffleArray(numbers);

        const board = [];
        for (let i = 0; i < numbers.length; i = i + BOARD.WIDTH)
            board.push(numbers.slice(i, i+BOARD.WIDTH));

        return board;
    }

    const openCard = (index, value) => {
        if (opened && opened.length === 2) {
            return;
        }

        if (opened === null) {
            setOpened({[index]: value});
        } else if (Object.keys(opened)[0] === index) {
            return;
        } else if (Object.values(opened)[0] === value) {
            const currOpened = { ...opened, [index]: value};
            setOpened(currOpened);

            setTimeout(() => {
                setSolved((pre) => [...pre, value]);
                setOpened(null)
            }, 1000);
        } else {
            const currOpened = { ...opened, [index]: value};
            setOpened(currOpened);

            setTimeout(() => {
                setOpened(null)
            }, 1000);
        }

    }

    useEffect(() => {
        setBoard(createBoard);
    }, []);

    const showBoard = board.length > 0;

    return (
        <div className="container">
            {showBoard && board.map((row, rowIndex) => {
                const cardRow = row.map((col, colIndex) => {
                    const currCard = board[rowIndex][colIndex];
                    const index = `${rowIndex}-${colIndex}`;
                    const isFound = solved.includes(currCard);
                    const isOpen = opened && opened[index] === currCard;
                    return (
                        <div
                            onClick={(e) => openCard(index, currCard)}
                            key={`${rowIndex}-${colIndex}`}
                            className={["card", isFound && 'found', isOpen && 'open'].filter(Boolean).join(' ')}
                        >
                            {isOpen ? currCard : null}
                        </div>
                    )
                })
                return (
                    <div className="rows" key={`row-${rowIndex}`}>{cardRow}</div>
                )
            })}
        </div>
    )
}