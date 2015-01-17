class ExpansionsController < ApplicationController
  def filter_cards
    @expansion = Expansion.filter_by(query_params)

    respond_to do |format|
      format.json { render json: @expansion }
    end
  end

  def code
    @expansion = Expansion.find_by(code: params[:code])

    respond_to do |format|
      format.json { render json: @expansion.cards }
    end
  end

  def set_list
    @expansions = Expansion.where.not(booster: nil)

    respond_to do |format|
      format.json { render json: @expansions }
    end
  end

  private

  def query_params
    params.require(:card_properties).permit(
      :id,
      :properties => [:card_colors, :card_type, :cmc],
      :not => [:card_colors, :card_type]
    )
  end
end
