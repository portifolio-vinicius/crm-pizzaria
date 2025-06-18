package com.example.crm.fidelidade;

import com.example.crm.cliente.Cliente;
import com.example.crm.pedido.Pedido;
import com.example.crm.cardapio.Categoria;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LoyaltyPointService {
    
    private final LoyaltyPointRepository repository;
    private final LoyaltyConfigService configService;

    public LoyaltyPointService(LoyaltyPointRepository repository, LoyaltyConfigService configService) {
        this.repository = repository;
        this.configService = configService;
    }

    public LoyaltyPoint save(LoyaltyPoint lp) {
        return repository.save(lp);
    }

    public List<LoyaltyPoint> findAll() {
        return repository.findAll();
    }

    public List<LoyaltyPoint> findByClienteId(Long clienteId) {
        return repository.findByClienteId(clienteId);
    }

    /**
     * Versão atualizada para usar configuração normalizada
     * Agora processa pontos por categoria de produto no pedido
     */
    public void accruePointsFromPedido(Pedido pedido) {
        if (pedido == null || pedido.getCliente() == null || pedido.getItens() == null) {
            return;
        }

        // Agrupa itens por categoria e calcula pontos separadamente
        pedido.getItens().stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        item -> item.getProduto().getCategoria(),
                        java.util.stream.Collectors.summingDouble(
                                item -> item.getQuantidade() * item.getPrecoUnitario()
                        )
                ))
                .forEach((categoria, valorCategoria) -> {
                    accruePointsForCategoria(pedido, categoria, valorCategoria);
                });
    }

    private void accruePointsForCategoria(Pedido pedido, Categoria categoria, Double valorCategoria) {
        Long categoriaId = categoria != null ? categoria.getId() : null;
        LoyaltyConfig config = configService.getBestConfigurationForCategoria(categoriaId);
        
        Integer pontos = config.calcularPontos(valorCategoria);
        
        if (pontos > 0) {
            LoyaltyPoint lp = new LoyaltyPoint();
            lp.setCliente(pedido.getCliente());
            lp.setPedido(pedido);
            lp.setConfig(config);
            lp.setPontos(pontos);
            lp.setValorPedido(valorCategoria);
            repository.save(lp);
        }
    }

    /**
     * Método legado mantido para compatibilidade
     * @deprecated Use accruePointsFromPedido(Pedido pedido) instead
     */
    @Deprecated
    public void accruePoints(Cliente cliente, Double valorPedido) {
        if (cliente == null || valorPedido == null) {
            return;
        }
        
        LoyaltyConfig config = configService.getBestConfigurationForCategoria(null); // Configuração geral
        Integer pontos = config.calcularPontos(valorPedido);
        
        if (pontos > 0) {
            LoyaltyPoint lp = new LoyaltyPoint();
            lp.setCliente(cliente);
            lp.setConfig(config);
            lp.setPontos(pontos);
            lp.setValorPedido(valorPedido);
            repository.save(lp);
        }
    }
}
