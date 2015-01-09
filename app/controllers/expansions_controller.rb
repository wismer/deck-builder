class ExpansionsController < ApplicationController
  def code
    @expansion = Expansion.find_by(code: params[:code])

    respond_to do |format|
      format.json { render json: @expansion, include: :cards }
    end
  end

  def set_list
    @expansions = Expansion.all

    respond_to do |format|
      format.json { render json: @expansions }
    end
  end
end
