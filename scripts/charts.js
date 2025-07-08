// ==================== SISTEMA DE GRÁFICOS ==================== //
const Charts = {
    /**
     * Renderiza gráfico de donut para uso de armazenamento
     */
    renderStorageChart: function(containerId, data) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                Logger.error('Container do gráfico não encontrado:', containerId);
                return;
            }
            
            const { used, total } = data;
            const percentage = (used / total) * 100;
            const remaining = total - used;
            
            // Cria SVG
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '200');
            svg.setAttribute('height', '200');
            svg.setAttribute('viewBox', '0 0 200 200');
            
            // Configurações do gráfico
            const centerX = 100;
            const centerY = 100;
            const radius = 80;
            const strokeWidth = 16;
            
            // Círculo de fundo
            const backgroundCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            backgroundCircle.setAttribute('cx', centerX);
            backgroundCircle.setAttribute('cy', centerY);
            backgroundCircle.setAttribute('r', radius);
            backgroundCircle.setAttribute('fill', 'none');
            backgroundCircle.setAttribute('stroke', '#E9ECEF');
            backgroundCircle.setAttribute('stroke-width', strokeWidth);
            
            // Círculo de progresso
            const progressCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            progressCircle.setAttribute('cx', centerX);
            progressCircle.setAttribute('cy', centerY);
            progressCircle.setAttribute('r', radius);
            progressCircle.setAttribute('fill', 'none');
            progressCircle.setAttribute('stroke', CONFIG.THEME.PRIMARY_COLOR);
            progressCircle.setAttribute('stroke-width', strokeWidth);
            progressCircle.setAttribute('stroke-linecap', 'round');
            
            // Calcula circunferência e offset
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (percentage / 100) * circumference;
            
            progressCircle.setAttribute('stroke-dasharray', circumference);
            progressCircle.setAttribute('stroke-dashoffset', offset);
            progressCircle.setAttribute('transform', `rotate(-90 ${centerX} ${centerY})`);
            
            // Texto central
            const textGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            textGroup.setAttribute('text-anchor', 'middle');
            textGroup.setAttribute('dominant-baseline', 'middle');
            
            const percentageText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            percentageText.setAttribute('x', centerX);
            percentageText.setAttribute('y', centerY - 10);
            percentageText.setAttribute('font-size', '24');
            percentageText.setAttribute('font-weight', '600');
            percentageText.setAttribute('fill', CONFIG.THEME.TEXT_COLOR);
            percentageText.textContent = `${percentage.toFixed(1)}%`;
            
            const labelText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            labelText.setAttribute('x', centerX);
            labelText.setAttribute('y', centerY + 15);
            labelText.setAttribute('font-size', '12');
            labelText.setAttribute('fill', CONFIG.THEME.TEXT_COLOR);
            labelText.textContent = 'Usado';
            
            textGroup.appendChild(percentageText);
            textGroup.appendChild(labelText);
            
            // Monta o SVG
            svg.appendChild(backgroundCircle);
            svg.appendChild(progressCircle);
            svg.appendChild(textGroup);
            
            // Limpa container e adiciona SVG
            container.innerHTML = '';
            container.appendChild(svg);
            
            // Adiciona informações adicionais
            const info = document.createElement('div');
            info.className = 'chart-info mt-3';
            info.innerHTML = `
                <div class="d-flex justify-content-between mb-2">
                    <span>Usado:</span>
                    <strong>${Functions.formatFileSize(used)}</strong>
                </div>
                <div class="d-flex justify-content-between mb-2">
                    <span>Disponível:</span>
                    <strong>${Functions.formatFileSize(remaining)}</strong>
                </div>
                <div class="d-flex justify-content-between">
                    <span>Total:</span>
                    <strong>${Functions.formatFileSize(total)}</strong>
                </div>
            `;
            
            container.appendChild(info);
            
            Logger.success('Gráfico de armazenamento renderizado');
            
        } catch (error) {
            Logger.error('Erro ao renderizar gráfico de armazenamento:', error);
        }
    },
    
    /**
     * Renderiza gráfico de barras simples
     */
    renderBarChart: function(containerId, data) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                Logger.error('Container do gráfico não encontrado:', containerId);
                return;
            }
            
            const maxValue = Math.max(...data.map(d => d.value));
            const chartHeight = 300;
            const chartWidth = 400;
            const barWidth = chartWidth / data.length - 10;
            
            // Cria SVG
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', chartWidth);
            svg.setAttribute('height', chartHeight + 50);
            svg.setAttribute('viewBox', `0 0 ${chartWidth} ${chartHeight + 50}`);
            
            // Renderiza barras
            data.forEach((item, index) => {
                const barHeight = (item.value / maxValue) * chartHeight;
                const x = index * (barWidth + 10) + 10;
                const y = chartHeight - barHeight;
                
                // Barra
                const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                bar.setAttribute('x', x);
                bar.setAttribute('y', y);
                bar.setAttribute('width', barWidth);
                bar.setAttribute('height', barHeight);
                bar.setAttribute('fill', CONFIG.THEME.PRIMARY_COLOR);
                bar.setAttribute('rx', 4);
                
                // Label
                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', x + barWidth / 2);
                label.setAttribute('y', chartHeight + 20);
                label.setAttribute('text-anchor', 'middle');
                label.setAttribute('font-size', '12');
                label.setAttribute('fill', CONFIG.THEME.TEXT_COLOR);
                label.textContent = item.label;
                
                // Valor
                const value = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                value.setAttribute('x', x + barWidth / 2);
                value.setAttribute('y', y - 5);
                value.setAttribute('text-anchor', 'middle');
                value.setAttribute('font-size', '11');
                value.setAttribute('font-weight', '600');
                value.setAttribute('fill', CONFIG.THEME.TEXT_COLOR);
                value.textContent = item.value;
                
                svg.appendChild(bar);
                svg.appendChild(label);
                svg.appendChild(value);
            });
            
            // Limpa container e adiciona SVG
            container.innerHTML = '';
            container.appendChild(svg);
            
            Logger.success('Gráfico de barras renderizado');
            
        } catch (error) {
            Logger.error('Erro ao renderizar gráfico de barras:', error);
        }
    },
    
    /**
     * Renderiza gráfico de linha simples
     */
    renderLineChart: function(containerId, data) {
        try {
            const container = document.getElementById(containerId);
            if (!container) {
                Logger.error('Container do gráfico não encontrado:', containerId);
                return;
            }
            
            const chartHeight = 200;
            const chartWidth = 400;
            const maxValue = Math.max(...data.map(d => d.value));
            const minValue = Math.min(...data.map(d => d.value));
            const valueRange = maxValue - minValue || 1;
            
            // Cria SVG
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', chartWidth);
            svg.setAttribute('height', chartHeight + 50);
            svg.setAttribute('viewBox', `0 0 ${chartWidth} ${chartHeight + 50}`);
            
            // Calcula pontos
            const points = data.map((item, index) => {
                const x = (index / (data.length - 1)) * chartWidth;
                const y = chartHeight - ((item.value - minValue) / valueRange) * chartHeight;
                return { x, y, ...item };
            });
            
            // Cria linha
            const pathData = points.map((point, index) => {
                return `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
            }).join(' ');
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', pathData);
            path.setAttribute('stroke', CONFIG.THEME.PRIMARY_COLOR);
            path.setAttribute('stroke-width', 2);
            path.setAttribute('fill', 'none');
            
            svg.appendChild(path);
            
            // Adiciona pontos
            points.forEach(point => {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', point.x);
                circle.setAttribute('cy', point.y);
                circle.setAttribute('r', 4);
                circle.setAttribute('fill', CONFIG.THEME.PRIMARY_COLOR);
                
                svg.appendChild(circle);
            });
            
            // Limpa container e adiciona SVG
            container.innerHTML = '';
            container.appendChild(svg);
            
            Logger.success('Gráfico de linha renderizado');
            
        } catch (error) {
            Logger.error('Erro ao renderizar gráfico de linha:', error);
        }
    },
    
    /**
     * Dados de exemplo para demonstração
     */
    getSampleStorageData: function() {
        return {
            used: 2.5 * 1024 * 1024 * 1024, // 2.5 GB
            total: 10 * 1024 * 1024 * 1024  // 10 GB
        };
    },
    
    getSampleBarData: function() {
        return [
            { label: 'Imagens', value: 45 },
            { label: 'Vídeos', value: 30 },
            { label: 'Áudios', value: 15 },
            { label: 'Documentos', value: 10 }
        ];
    },
    
    getSampleLineData: function() {
        return [
            { label: 'Jan', value: 20 },
            { label: 'Fev', value: 35 },
            { label: 'Mar', value: 25 },
            { label: 'Abr', value: 45 },
            { label: 'Mai', value: 40 },
            { label: 'Jun', value: 55 }
        ];
    }
};

// Torna o Charts global
window.Charts = Charts;
