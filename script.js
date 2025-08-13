document.addEventListener('DOMContentLoaded', () => {
    const towers = document.querySelectorAll('.tower');
    const resetButton = document.getElementById('reset-button');
    const moveCountSpan = document.getElementById('move-count');
    const messageP = document.getElementById('message');

    let towersState = [[], [], []];
    let selectedDisk = null;
    let sourceTower = null;
    let moveCount = 0;
    const numDisks = 5;

    function setupGame() {
        towersState = [[], [], []];
        for (let i = numDisks; i > 0; i--) {
            towersState[0].push(i);
        }
        moveCount = 0;
        selectedDisk = null;
        sourceTower = null;
        messageP.textContent = '';
        render();
        updateMoveCount();
    }

    function render() {
        towers.forEach((tower, towerIndex) => {
            tower.innerHTML = '';
            towersState[towerIndex].forEach((diskSize, diskIndex) => {
                const disk = document.createElement('div');
                disk.classList.add('disk', `disk-${diskSize}`);
                disk.dataset.size = diskSize;
                disk.style.bottom = `${diskIndex * 20}px`;
                tower.appendChild(disk);
            });
        });
        // Remove selection highlight after render
        const selectedElement = document.querySelector('.selected');
        if (selectedElement) {
            selectedElement.classList.remove('selected');
        }
        // Add selection highlight if a disk is selected
        if (sourceTower !== null) {
            const sourceTowerElement = towers[sourceTower];
            const diskElements = sourceTowerElement.querySelectorAll('.disk');
            if (diskElements.length > 0) {
                diskElements[diskElements.length - 1].classList.add('selected');
            }
        }
    }

    function updateMoveCount() {
        moveCountSpan.textContent = moveCount;
    }

    function processMove(towerIndex) {
        if (selectedDisk !== null) {
            // Try to place the disk
            const targetTowerState = towersState[towerIndex];
            if (targetTowerState.length > 0 && selectedDisk > targetTowerState[targetTowerState.length - 1]) {
                // Invalid move
                messageP.textContent = 'Invalid move!';
                setTimeout(() => messageP.textContent = '', 2000);
            } else {
                // Valid move
                if (sourceTower !== towerIndex) { // Prevent moving to the same tower
                    towersState[sourceTower].pop();
                    targetTowerState.push(selectedDisk);
                    moveCount++;
                    updateMoveCount();
                    checkWinCondition();
                }
            }
            selectedDisk = null;
            sourceTower = null;
        } else {
            // Try to pick up a disk
            if (towersState[towerIndex].length > 0) {
                sourceTower = towerIndex;
                selectedDisk = towersState[towerIndex][towersState[towerIndex].length - 1];
            }
        }
        render();
    }

    function handleTowerClick(e) {
        const towerElement = e.currentTarget;
        const towerIndex = parseInt(towerElement.dataset.tower) - 1;
        processMove(towerIndex);
    }

    function handleKeyPress(e) {
        const key = e.key;
        if (key >= '1' && key <= '3') {
            const towerIndex = parseInt(key) - 1;
            processMove(towerIndex);
        }
    }

    function checkWinCondition() {
        if (towersState[2].length === numDisks) {
            messageP.textContent = `You won in ${moveCount} moves!`;
        }
    }

    towers.forEach(tower => tower.addEventListener('click', handleTowerClick));
    document.addEventListener('keydown', handleKeyPress);
    resetButton.addEventListener('click', setupGame);

    setupGame();
});
